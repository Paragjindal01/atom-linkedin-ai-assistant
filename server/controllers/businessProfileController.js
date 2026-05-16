const db = require('../config/db');

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await db.query(
      'SELECT * FROM business_profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(profiles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createProfile = async (req, res) => {
  const {
    business_name,
    industry,
    product_service_description,
    target_audience,
    brand_tone,
    marketing_goal,
    website_url
  } = req.body;

  try {
    const newProfile = await db.query(
      `INSERT INTO business_profiles 
      (user_id, business_name, industry, product_service_description, target_audience, brand_tone, marketing_goal, website_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [req.user.id, business_name, industry, product_service_description, target_audience, brand_tone, marketing_goal, website_url]
    );

    res.json(newProfile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const {
    business_name,
    industry,
    product_service_description,
    target_audience,
    brand_tone,
    marketing_goal,
    website_url
  } = req.body;

  try {
    // Ensure the profile belongs to the user
    const profile = await db.query('SELECT * FROM business_profiles WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: 'Profile not found or unauthorized' });
    }

    const updatedProfile = await db.query(
      `UPDATE business_profiles SET 
      business_name = $1, 
      industry = $2, 
      product_service_description = $3, 
      target_audience = $4, 
      brand_tone = $5, 
      marketing_goal = $6, 
      website_url = $7,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND user_id = $9
      RETURNING *`,
      [business_name, industry, product_service_description, target_audience, brand_tone, marketing_goal, website_url, id, req.user.id]
    );

    res.json(updatedProfile.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await db.query('SELECT * FROM business_profiles WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (profile.rows.length === 0) {
      return res.status(404).json({ msg: 'Profile not found or unauthorized' });
    }

    await db.query('DELETE FROM business_profiles WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    
    res.json({ msg: 'Business profile removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
