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
