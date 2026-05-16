/**
 * Placeholder Service for LinkedIn Automation
 */

exports.getAuthUrl = () => {
  // Return a safe placeholder URL or a real constructed URL if env vars exist
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return 'http://localhost:5173/linkedin-automation?error=missing_config';
  }
  const state = Math.random().toString(36).substring(7);
  const scope = 'openid profile email w_member_social';
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
};

exports.exchangeCodeForToken = async (code) => {
  // Safe placeholder: return a fake token object
  console.log("Mock exchanging code for token:", code);
  return {
    access_token: 'mock_access_token_123',
    expires_in: 5184000, // 60 days
    refresh_token: 'mock_refresh_token_456',
    refresh_token_expires_in: 31536000 // 1 year
  };
};

exports.fetchProfile = async (accessToken) => {
  console.log("Mock fetching profile with token:", accessToken);
  return {
    id: 'mock_member_id_789'
  };
};

exports.publishPost = async (accountId, text) => {
  console.log(`Mock publishing post to account ${accountId}: ${text}`);
  return {
    success: false,
    message: "LinkedIn API not connected yet. This is a safe placeholder.",
    post_id: null
  };
};

exports.fetchComments = async (postId) => {
  console.log(`Mock fetching comments for post ${postId}`);
  return [];
};

exports.replyToComment = async (commentId, text) => {
  console.log(`Mock replying to comment ${commentId}: ${text}`);
  return {
    success: false,
    message: "LinkedIn API not connected yet."
  };
};
