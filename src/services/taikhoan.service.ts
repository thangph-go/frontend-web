import apiClient from './api';

export interface TaiKhoan {
  id: number;
  ten_dang_nhap: string;
  vai_tro: 'ADMIN' | 'STAFF';
}

export interface CreateStaffDTO {
  ten_dang_nhap: string;
  mat_khau: string;
}

export const getAllAccounts = async () => {
  try {
    const response = await apiClient.get<TaiKhoan[]>('/taikhoan');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách tài khoản');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const createStaffAccount = async (data: CreateStaffDTO) => {
  try {
    const response = await apiClient.post('/taikhoan/staff', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tạo tài khoản');
  }
};