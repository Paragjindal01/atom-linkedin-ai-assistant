/**
 * Placeholder Service for LinkedIn Automation
 */

const jwt = require('jsonwebtoken');

exports.getAuthUrl = (userId) => {
  // Return a safe placeholder URL or a real constructed URL if env vars exist
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return 'http://localhost:5173/linkedin-automation?error=missing_config';
  }
  const statePayload = { userId };
  const state = jwt.sign(statePayload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
  const scope = 'openid profile email w_member_social';
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
};

exports.exchangeCodeForToken = async (code) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("LinkedIn token exchange failed:", errorData);
    throw new Error('Failed to exchange code for token');
  }

  return await response.json();
};

exports.fetchProfile = async (accessToken) => {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("LinkedIn fetch profile failed:", errorData);
    throw new Error('Failed to fetch LinkedIn profile');
  }

  const data = await response.json();
  // userinfo returns "sub" for the member id
  return {
    id: data.sub,
    ...data
  };
};

exports.publishPost = async (accessToken, linkedinMemberId, text) => {
  const url = 'https://api.linkedin.com/v2/ugcPosts';
  const body = {
    "author": `urn:li:person:${linkedinMemberId}`,
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": {
          "text": text
        },
        "shareMediaCategory": "NONE"
      }
    },
    "visibility": {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("LinkedIn publish failed:", errorData);
    throw new Error('Failed to publish to LinkedIn');
  }

  const data = await response.json();
  return {
    success: true,
    post_id: data.id || null
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
