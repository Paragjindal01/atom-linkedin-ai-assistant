import api from './api';

export const getBusinessProfile = async () => {
  const response = await api.get('/business-profile');
  return response.data;
};

export const createBusinessProfile = async (data) => {
  const response = await api.post('/business-profile', data);
  return response.data;
};

export const updateBusinessProfile = async (id, data) => {
  const response = await api.put(`/business-profile/${id}`, data);
  return response.data;
};
