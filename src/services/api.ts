/*
 * File: api.ts
 * Nhiệm vụ:
 * 1. Tạo một "instance" (phiên bản) Axios tập trung cho toàn bộ dự án.
 * 2. Cấu hình baseURL (địa chỉ gốc) cho tất cả các API.
 * 3. Thiết lập "Request Interceptor" (Bộ chặn Gửi đi) để tự động gắn JWT Token
 * vào header 'Authorization' của mọi yêu cầu.
 * 4. Thiết lập "Response Interceptor" (Bộ chặn Nhận về) để tự động xử lý
 * lỗi 401 (Unauthorized - Token hết hạn), xóa Token hỏng và đá người dùng về trang Login.
 */

import axios from 'axios';

// --- 1. TẠO AXIOS INSTANCE ---

// Lấy URL gốc của Backend từ biến môi trường
// Vercel sẽ cung cấp biến này, còn ở local, nó sẽ là undefined
const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  // Nếu API_URL (trên Vercel) tồn tại, dùng nó.
  // Nếu không (đang chạy local), dùng 'http://localhost:8000'
  baseURL: API_URL ? `${API_URL}/api` : 'http://localhost:8000/api'
});

// --- 2. THIẾT LẬP REQUEST INTERCEPTOR (GỬI ĐI) ---

apiClient.interceptors.request.use(
  (config) => {
    // Đoạn code này sẽ chạy TRƯỚC KHI mọi yêu cầu API được gửi đi

    // 1. Lấy token từ localStorage
    const token = localStorage.getItem('authToken');

    // 2. Nếu có token, gắn nó vào header Authorization
    if (token) {
      // (Backend 'authMiddleware' sẽ đọc header này)
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Trả về config để yêu cầu tiếp tục
    return config;
  },
  (error) => {
    // Xử lý lỗi (hiếm khi xảy ra ở đây)
    return Promise.reject(error);
  }
);

// --- 3. THIẾT LẬP RESPONSE INTERCEPTOR (NHẬN VỀ) ---

apiClient.interceptors.response.use(
  // (a) Nếu Response thành công (status 2xx), cứ trả về
  (response) => {
    return response;
  },
  // (b) Nếu Response thất bại (status 4xx, 5xx)
  (error) => {
    
    // Kiểm tra xem có phải lỗi 401 (Unauthorized) không
    if (error.response && error.response.status === 401) {
      
      // Lỗi 401: Token không hợp lệ hoặc đã hết hạn
      console.error('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
      
      // Xóa token hỏng và thông tin người dùng
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      
      // "Đá" người dùng về trang login
      // (Chúng ta dùng window.location.href vì đây là file service,
      //  không phải React component nên không dùng useNavigate được)
      window.location.href = '/login';
    }
    
    // Đối với các lỗi khác (403, 404, 500...),
    // ném lỗi ra để component (ví dụ: HocVienPage) có thể
    // bắt (catch) và hiển thị thông báo (Notification)
    return Promise.reject(error);
  }
);

// --- 4. EXPORT ---

// Xuất instance đã cấu hình này ra để các file service khác (hocvien.service.ts,...) sử dụng
export default apiClient;