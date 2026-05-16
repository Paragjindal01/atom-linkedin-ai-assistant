const db = require('../config/db');
const linkedinService = require('../services/linkedinService');
const jwt = require('jsonwebtoken');

exports.getStatus = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, linkedin_member_id, expires_at FROM linkedin_accounts WHERE user_id = $1 LIMIT 1',
      [req.user.id]
    );

    if (result.rows.length > 0) {
      // Basic check if expired
      const account = result.rows[0];
      const isExpired = new Date() > new Date(account.expires_at);
      
      return res.json({
        connected: true,
        expired: isExpired,
        account: {
          id: account.id,
          memberId: account.linkedin_member_id
        }
      });
    }

    res.json({ connected: false });
  } catch (error) {
    console.error("Error fetching LinkedIn status:", error);
    res.status(500).json({ error: "Server error checking connection status." });
  }
};

exports.getAuthUrl = (req, res) => {
  try {
    const url = linkedinService.getAuthUrl(req.user.id);
    res.json({ url });
  } catch (error) {
    console.error("Error getting auth URL:", error);
    res.status(500).json({ error: "Failed to generate LinkedIn authentication URL." });
  }
};

exports.handleCallback = async (req, res) => {
  const { code, state } = req.query;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  if (!code || !state) {
    return res.redirect(`${clientUrl}/linkedin-automation?error=missing_code_or_state`);
  }

  try {
    // Verify state and extract user_id
    const decoded = jwt.verify(state, process.env.JWT_SECRET || 'fallback_secret');
    const userId = decoded.userId;

    // 1. Exchange code for token
    const tokenData = await linkedinService.exchangeCodeForToken(code);
    
    // 2. Fetch member profile to get ID
    const profile = await linkedinService.fetchProfile(tokenData.access_token);
    const linkedinMemberId = profile.id;
    
    // Calculate expiration
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    const refreshToken = tokenData.refresh_token || null;

    // 3. Save to database (Upsert)
    const existing = await db.query('SELECT id FROM linkedin_accounts WHERE user_id = $1', [userId]);
    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE linkedin_accounts 
         SET linkedin_member_id = $1, access_token = $2, refresh_token = $3, expires_at = $4
         WHERE user_id = $5`,
        [linkedinMemberId, tokenData.access_token, refreshToken, expiresAt, userId]
      );
    } else {
      await db.query(
        `INSERT INTO linkedin_accounts (user_id, linkedin_member_id, access_token, refresh_token, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, linkedinMemberId, tokenData.access_token, refreshToken, expiresAt]
      );
    }

    // Safe redirect back to frontend
    res.redirect(`${clientUrl}/linkedin-automation?success=true`);
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.redirect(`${clientUrl}/linkedin-automation?error=auth_failed`);
  }
};

exports.publishPost = async (req, res) => {
  const { generated_content_id } = req.body;
  if (!generated_content_id) {
    return res.status(400).json({ error: "generated_content_id is required." });
  }

  try {
    // Check if content exists and is approved
    const contentResult = await db.query(
      'SELECT id, result, publishing_status, platform FROM generated_content WHERE id = $1 AND user_id = $2',
      [generated_content_id, req.user.id]
    );

    if (contentResult.rows.length === 0) {
      return res.status(404).json({ error: "Content not found." });
    }

    const content = contentResult.rows[0];
    if (content.publishing_status !== 'approved') {
      return res.status(400).json({ error: "Content must be approved before publishing." });
    }

    // Get LinkedIn account
    const accountResult = await db.query(
      'SELECT access_token, linkedin_member_id FROM linkedin_accounts WHERE user_id = $1 LIMIT 1',
      [req.user.id]
    );

    if (accountResult.rows.length === 0) {
      return res.status(400).json({ error: "LinkedIn account not connected." });
    }

    const account = accountResult.rows[0];

    // Publish
    const publishResult = await linkedinService.publishPost(
      account.access_token, 
      account.linkedin_member_id, 
      content.result
    );

    if (publishResult.success) {
      // Update status to posted
      await db.query(
        'UPDATE generated_content SET publishing_status = $1 WHERE id = $2',
        ['posted', generated_content_id]
      );
      
      // Create scheduled_posts row for tracking
      await db.query(
        `INSERT INTO scheduled_posts (user_id, generated_content_id, post_text, scheduled_for, status, linkedin_post_id)
         VALUES ($1, $2, $3, NOW(), 'posted', $4)`,
        [req.user.id, generated_content_id, content.result, publishResult.post_id]
      );

      return res.json({ success: true, post_id: publishResult.post_id });
    }

    res.status(500).json({ error: "Failed to publish." });

  } catch (error) {
    console.error("Publish Post Error:", error);
    res.status(500).json({ error: "Failed to publish post to LinkedIn." });
  }
};

exports.schedulePost = async (req, res) => {
  const { generated_content_id, post_text, scheduled_for } = req.body;

  if (!post_text || !scheduled_for) {
    return res.status(400).json({ error: "post_text and scheduled_for are required." });
  }

  try {
    const result = await db.query(
      `INSERT INTO scheduled_posts (user_id, generated_content_id, post_text, scheduled_for, status)
       VALUES ($1, $2, $3, $4, 'scheduled') RETURNING *`,
      [req.user.id, generated_content_id || null, post_text, scheduled_for]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Schedule Post Error:", error);
    res.status(500).json({ error: "Failed to schedule post." });
  }
};

exports.getScheduledPosts = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM scheduled_posts WHERE user_id = $1 ORDER BY scheduled_for ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Scheduled Posts Error:", error);
    res.status(500).json({ error: "Failed to fetch scheduled posts." });
  }
};
