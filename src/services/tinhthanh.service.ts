// File: src/services/tinhthanh.service.ts
import apiClient from './api';

// 1. Định nghĩa kiểu dữ liệu (Interface) cho TinhThanh
export interface TinhThanh {
  ma_tinh: string;
  ten_tinh: string;
}

// 2. Hàm gọi API GET /api/tinhthanh
export const getAllTinhThanh = async () => {
  try {
    const response = await apiClient.get<TinhThanh[]>('/tinhthanh');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải dữ liệu tỉnh thành');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};