// File: src/services/taikhoan.service.ts
import apiClient from './api';

// 1. Định nghĩa kiểu dữ liệu (Interface) cho Tài Khoản
// (Phải khớp với API Backend trả về)
export interface TaiKhoan {
  id: number;
  ten_dang_nhap: string;
  vai_tro: 'ADMIN' | 'STAFF';
}

export interface CreateStaffDTO {
  ten_dang_nhap: string;
  mat_khau: string;
  // Các trường khác không cần gửi lên nữa
}


// 2. Hàm gọi API GET /api/taikhoan
// (API này đã được bảo vệ bởi authMiddleware + adminMiddleware)
export const getAllAccounts = async () => {
  try {
    const response = await apiClient.get<TaiKhoan[]>('/taikhoan');
    return response.data;
  } catch (error: any) {
    // Interceptor (api.ts) sẽ tự động xử lý lỗi 401 (đá về login)
    // Chúng ta chỉ cần ném lỗi 403 (Forbidden) hoặc 500
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách tài khoản');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};


// [MỚI] Hàm gọi API tạo Staff
export const createStaffAccount = async (data: CreateStaffDTO) => {
  try {
    const response = await apiClient.post('/taikhoan/staff', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tạo tài khoản');
  }
};