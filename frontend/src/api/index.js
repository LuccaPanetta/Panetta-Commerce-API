import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', 
});

export const getProducts = () => api.get('/products/');
export const loginUser = (formData) => api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

export default api;