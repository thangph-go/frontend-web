import apiClient from './api';

interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (ten_dang_nhap: string, mat_khau: string) => {
  try {

    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      {
        ten_dang_nhap,
        mat_khau
      }
    );
    return response.data;

  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Đã có lỗi xảy ra');
    } 
    else {
      console.error('Lỗi Axios (Auth Service):', error.message);
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};
