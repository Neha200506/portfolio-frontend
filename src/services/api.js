import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://portfolio-backend-rz1n.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
