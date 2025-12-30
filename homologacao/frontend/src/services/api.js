import axios from 'axios';

// FORCE URL to 3000 to bypass cache issues
const API_URL = 'http://localhost:3000';
console.log('API URL (Forced):', API_URL);

const api = axios.create({
    baseURL: API_URL,
});

export default api;
