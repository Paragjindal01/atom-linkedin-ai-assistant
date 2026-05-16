import api from './api';

export const getLinkedInStatus = async () => {
  const response = await api.get('/linkedin/status');
  return response.data;
};

export const getAuthUrl = async () => {
  const response = await api.get('/linkedin/auth-url');
  return response.data;
};

export const publishPostToLinkedIn = async (generatedContentId) => {
  const response = await api.post('/linkedin/publish-post', { generated_content_id: generatedContentId });
  return response.data;
};

export const schedulePost = async (data) => {
  const response = await api.post('/linkedin/schedule-post', data);
  return response.data;
};

export const getScheduledPosts = async () => {
  const response = await api.get('/linkedin/scheduled-posts');
  return response.data;
};
