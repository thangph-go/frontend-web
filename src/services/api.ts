/*
 * File: api.ts
 * Đã sửa lỗi: Tự động reload khi nhập sai mật khẩu
 */

import axios from 'axios';

// --- 1. TẠO AXIOS INSTANCE ---

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : 'http://localhost:8000/api'
});

// --- 2. THIẾT LẬP REQUEST INTERCEPTOR (GỬI ĐI) ---

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

// --- 3. THIẾT LẬP RESPONSE INTERCEPTOR (NHẬN VỀ) ---

apiClient.interceptors.response.use(
  // (a) Nếu Response thành công
  (response) => {
    return response;
  },
  // (b) Nếu Response thất bại
  (error) => {
    
    // Lấy thông tin về request gốc để biết lỗi này đến từ đâu
    const originalRequest = error.config;

    // Kiểm tra xem có phải lỗi 401 (Unauthorized) không
    if (error.response && error.response.status === 401) {

      // --- [FIX QUAN TRỌNG BẮT ĐẦU] ---
      
      // Nếu lỗi 401 đến từ API "/auth/login", nghĩa là người dùng nhập sai Pass/User.
      // Chúng ta KHÔNG ĐƯỢC reload trang hay xóa token lúc này.
      // Hãy trả lỗi về để LoginPage hiển thị dòng chữ đỏ.
      if (originalRequest && originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // --- [FIX QUAN TRỌNG KẾT THÚC] ---

      
      // Nếu lỗi 401 đến từ các trang khác (ví dụ đang ở trang Admin mà token hết hạn)
      // Thì mới thực hiện logic "đá" người dùng ra.
      console.error('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// --- 4. EXPORT ---
export default apiClient;