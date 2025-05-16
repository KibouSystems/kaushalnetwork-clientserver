import axios from 'axios';

const api = axios.create({
  baseURL: 'http://69.62.79.102:3000/api/v0',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginCompanyUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/company-user/login', credentials);
  return response.data;
};

export default api;
