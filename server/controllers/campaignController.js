const db = require('../config/db');

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await db.query(
      'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(campaigns.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCampaignById = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await db.query(
      'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (campaign.rows.length === 0) {
      return res.status(404).json({ msg: 'Campaign not found or unauthorized' });
    }
    res.json(campaign.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createCampaign = async (req, res) => {
  const { business_profile_id, name, goal, status, description } = req.body;

  try {
    const newCampaign = await db.query(
      `INSERT INTO campaigns 
      (user_id, business_profile_id, name, goal, description, status) 
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'draft')) 
      RETURNING *`,
      [req.user.id, business_profile_id, name, goal, description, status]
    );

    res.json(newCampaign.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { business_profile_id, name, goal, status, description } = req.body;

  try {
    const campaign = await db.query('SELECT * FROM campaigns WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (campaign.rows.length === 0) {
      return res.status(404).json({ msg: 'Campaign not found or unauthorized' });
    }

    const updatedCampaign = await db.query(
      `UPDATE campaigns SET 
      business_profile_id = $1, 
      name = $2, 
      goal = $3, 
      description = $4, 
      status = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *`,
      [business_profile_id, name, goal, description, status, id, req.user.id]
    );

    res.json(updatedCampaign.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await db.query('SELECT * FROM campaigns WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (campaign.rows.length === 0) {
      return res.status(404).json({ msg: 'Campaign not found or unauthorized' });
    }

    await db.query('DELETE FROM campaigns WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    
    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
