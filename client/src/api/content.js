import api from './api';

export const generateContent = async (data) => {
  const response = await api.post('/content/generate', data);
  return response.data;
};

export const getContentHistory = async () => {
  const response = await api.get('/content/history');
  return response.data;
};

export const deleteContent = async (id) => {
  const response = await api.delete(`/content/${id}`);
  return response.data;
};
