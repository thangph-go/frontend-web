import apiClient from './api';

export interface TinhThanh {
  ma_tinh: string;
  ten_tinh: string;
}

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