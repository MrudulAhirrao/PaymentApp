// services/api.ts
import axios from 'axios';
import { getToken } from '../utils/auth';

// IMPORTANT: Replace with your ngrok URL if it changes
const API_URL = 'https://30e2621b28ae.ngrok-free.app'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // **FIX:** This header tells ngrok to skip its warning page
  config.headers['ngrok-skip-browser-warning'] = 'true';

  return config;
});

export default api;
