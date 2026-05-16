const db = require('../config/db');
const linkedinService = require('../services/linkedinService');

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
    const url = linkedinService.getAuthUrl();
    res.json({ url });
  } catch (error) {
    console.error("Error getting auth URL:", error);
    res.status(500).json({ error: "Failed to generate LinkedIn authentication URL." });
  }
};

exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/linkedin-automation?error=missing_code`);
  }

  try {
    // 1. Exchange code for token
    const tokenData = await linkedinService.exchangeCodeForToken(code);
    
    // 2. Fetch member profile to get ID
    const profile = await linkedinService.fetchProfile(tokenData.access_token);
    
    // Calculate expiration
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // 3. Save to database (Upsert)
    // We assume the user is still logged in to our app and we passed user token via state or cookie,
    // BUT since this is an OAuth callback it's a direct GET request from LinkedIn.
    // For a real app, we usually encode a JWT or session ID into the `state` parameter of the OAuth request,
    // and verify it here. For this MVP foundation, we'll assume we parse user_id from the state parameter.
    // As a placeholder, we won't fully implement the callback saving without the decoded state.
    // Redirect back to frontend to complete saving if needed, or handle it via a POST from frontend.

    // Safe redirect back to frontend
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/linkedin-automation?success=true`);
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/linkedin-automation?error=auth_failed`);
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
