import apiClient from './api';

export interface EnrollmentInfo {
  ma_hoc_vien: string;
  ho_ten: string;
  ket_qua: 'ĐẠT' | 'KHÔNG ĐẠT' | 'CHƯA CẬP NHẬT';
  ngay_dang_ky?: string;
}

export interface StudentCourseHistory {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  ngay_dang_ky: string;
  ket_qua: 'ĐẠT' | 'KHÔNG ĐẠT' | 'CHƯA CẬP NHẬT';
  so_bai_da_hoan_thanh: number;
  tong_so_bai: number;
}

type RegisterDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
};

type UpdateResultDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
  ket_qua: 'ĐẠT' | 'KHÔNG ĐẠT' | 'CHƯA CẬP NHẬT';
};

export const registerStudentToCourse = async (data: RegisterDTO) => {
  try {
    const response = await apiClient.post('/dangky', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi đăng ký khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const updateEnrollmentResult = async (data: UpdateResultDTO) => {
  try {
    const response = await apiClient.put('/dangky', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi cập nhật kết quả');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getEnrollmentsByCourse = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<EnrollmentInfo[]>(`/dangky/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi tải danh sách');
  }
};

export const getEligibleStudents = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<EnrollmentInfo[]>(`/dangky/du-dieu-kien/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi tải danh sách đủ điều kiện');
  }
};

export const getCoursesByStudent = async (ma_hv: string) => {
  try {
    const response = await apiClient.get<StudentCourseHistory[]>(`/dangky/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải lịch sử học tập');
  }
};