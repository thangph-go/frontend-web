import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : 'http://localhost:8000/api'
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {

      if (originalRequest && originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      console.error('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;