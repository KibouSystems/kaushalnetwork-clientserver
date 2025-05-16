import axios from 'axios';
import { tokenManager } from './tokenManager';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v0',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = tokenManager.getToken();
  // console.warn('Token:', token); // Debugging line to check the token value

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
