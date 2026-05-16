const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const [
      campaignStatsResult,
      totalContentResult,
      totalProfilesResult,
      recentCampaignsResult,
      recentContentResult,
      contentByPlatformResult,
      contentByTypeResult
    ] = await Promise.all([
      db.query(
        `SELECT 
          COUNT(*)::int as "totalCampaigns",
          COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)::int, 0) as "activeCampaigns",
          COALESCE(SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END)::int, 0) as "draftCampaigns",
          COALESCE(SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END)::int, 0) as "archivedCampaigns"
         FROM campaigns WHERE user_id = $1`,
        [userId]
      ),
      db.query('SELECT COUNT(*)::int as total FROM generated_content WHERE user_id = $1', [userId]),
      db.query('SELECT COUNT(*)::int as total FROM business_profiles WHERE user_id = $1', [userId]),
      db.query('SELECT id, name, status, created_at FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]),
      db.query('SELECT id, content_type, platform, topic, created_at FROM generated_content WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', [userId]),
      db.query('SELECT platform, COUNT(*)::int as count FROM generated_content WHERE user_id = $1 AND platform IS NOT NULL GROUP BY platform ORDER BY count DESC', [userId]),
      db.query('SELECT content_type, COUNT(*)::int as count FROM generated_content WHERE user_id = $1 AND content_type IS NOT NULL GROUP BY content_type ORDER BY count DESC', [userId])
    ]);

    const campaignStats = campaignStatsResult.rows[0];

    res.json({
      totalCampaigns: campaignStats.totalCampaigns,
      activeCampaigns: campaignStats.activeCampaigns,
      draftCampaigns: campaignStats.draftCampaigns,
      archivedCampaigns: campaignStats.archivedCampaigns,
      totalGeneratedContent: totalContentResult.rows[0].total,
      totalBusinessProfiles: totalProfilesResult.rows[0].total,
      recentCampaigns: recentCampaignsResult.rows,
      recentGeneratedContent: recentContentResult.rows,
      contentByPlatform: contentByPlatformResult.rows,
      contentByType: contentByTypeResult.rows
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error.message);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
};
