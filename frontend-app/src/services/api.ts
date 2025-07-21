import axios from 'axios';

// Ganti port 3000 sesuai dengan port backend Anda
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export default api;