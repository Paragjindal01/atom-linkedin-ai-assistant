const db = require('../config/db');
const { buildMarketingPrompt } = require('../utils/promptBuilder');
const { generateContent } = require('../services/openaiService');

exports.generateAIContent = async (req, res) => {
  const {
    business_profile_id,
    campaign_id,
    content_type,
    platform,
    tone,
    topic,
    keywords,
    word_count
  } = req.body;

  if (!business_profile_id || !content_type || !platform || !topic) {
    return res.status(400).json({ error: 'Missing required fields: business_profile_id, content_type, platform, topic are required.' });
  }

  try {
    // 1. Verify business profile belongs to user
    const profileResult = await db.query(
      'SELECT * FROM business_profiles WHERE id = $1 AND user_id = $2',
      [business_profile_id, req.user.id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Business profile not found or unauthorized' });
    }
    const profile = profileResult.rows[0];

    // 2. Verify campaign if provided
    if (campaign_id) {
      const campaignResult = await db.query(
        'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
        [campaign_id, req.user.id]
      );
      if (campaignResult.rows.length === 0) {
        return res.status(404).json({ error: 'Campaign not found or unauthorized' });
      }
    }

    // 3. Build prompt
    const prompt = buildMarketingPrompt(profile, {
      content_type,
      platform,
      tone,
      topic,
      keywords,
      word_count
    });

    // 4. Call OpenAI API
    const generatedText = await generateContent(prompt);

    const keywordsText = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    // 5. Save generated result
    const newContentResult = await db.query(
      `INSERT INTO generated_content 
      (user_id, business_profile_id, campaign_id, content_type, platform, tone, topic, keywords, word_count, prompt, result) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [req.user.id, business_profile_id, campaign_id || null, content_type, platform, tone || null, topic, keywordsText || null, word_count || null, prompt, generatedText]
    );

    // 6. Log usage (optional but good practice as per schema)
    await db.query(
      'INSERT INTO usage_logs (user_id, action, tokens_used) VALUES ($1, $2, $3)',
      [req.user.id, 'generate_content', 0] // 0 because we didn't extract exact token usage for simplicity, can be updated
    );

    res.status(201).json(newContentResult.rows[0]);
  } catch (error) {
    console.error('Content Generation Error:', error);
    if (error.code === 'OPENAI_KEY_MISSING') {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Server error during content generation' });
  }
};

exports.getContentHistory = async (req, res) => {
  try {
    const history = await db.query(
      'SELECT * FROM generated_content WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(history.rows);
  } catch (error) {
    console.error('Fetch History Error:', error.message);
    res.status(500).json({ error: 'Server error fetching history' });
  }
};

exports.deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    const contentCheck = await db.query(
      'SELECT * FROM generated_content WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (contentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found or unauthorized' });
    }

    await db.query('DELETE FROM generated_content WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    
    res.json({ msg: 'Content successfully deleted' });
  } catch (error) {
    console.error('Delete Content Error:', error.message);
    res.status(500).json({ error: 'Server error deleting content' });
  }
};

exports.updateContentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['draft', 'approved', 'posted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await db.query(
      'UPDATE generated_content SET publishing_status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ error: 'Server error updating content status' });
  }
};
