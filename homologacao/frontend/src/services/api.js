import axios from 'axios';

// Use environment variable from Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
});

export default api;
