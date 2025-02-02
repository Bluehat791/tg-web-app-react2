const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const endpoints = {
    products: `${API_URL}/api/products`,
    orders: `${API_URL}/api/orders`,
};

export default API_URL; 