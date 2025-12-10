import apiClient from './api';

export interface KhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  deleted_at: string | null;
}

export type KhoaHocFormData = {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
};

export interface NoiDungKhoaHoc {
  id: number;
  ma_khoa_hoc: string;
  ten_noi_dung: string;
  mo_ta: string;
  thu_tu: number;
  trang_thai?: 'HOÀN THÀNH' | 'CHƯA HOÀN THÀNH'; 
}

export const getAllKhoaHoc = async () => {
  try {
    const response = await apiClient.get<KhoaHoc[]>('/khoahoc');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải danh sách khóa học');
  }
};

export const getKhoaHocById = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<KhoaHoc>(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải chi tiết khóa học');
  }
};

export const createKhoaHoc = async (data: KhoaHocFormData) => {
  try {
    const response = await apiClient.post('/khoahoc', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tạo khóa học');
  }
};

export const updateKhoaHoc = async (ma_kh: string, data: KhoaHocFormData) => {
  try {
    const response = await apiClient.put(`/khoahoc/${ma_kh}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật khóa học');
  }
};

export const deleteKhoaHoc = async (ma_kh: string) => {
  try {
    const response = await apiClient.delete(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa khóa học');
  }
};

export const getCourseModules = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<NoiDungKhoaHoc[]>(`/khoahoc/${ma_kh}/noidung`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải nội dung khóa học');
  }
};

export const addCourseModule = async (ma_kh: string, data: { ten_noi_dung: string, mo_ta?: string, thu_tu?: number }) => {
  try {
    const response = await apiClient.post(`/khoahoc/${ma_kh}/noidung`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi thêm nội dung');
  }
};

export const deleteCourseModule = async (id_noi_dung: number) => {
  try {
    const response = await apiClient.delete(`/khoahoc/noidung/${id_noi_dung}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa nội dung');
  }
};

export const getStudentProgress = async (ma_kh: string, ma_hv: string) => {
  try {
    const response = await apiClient.get<NoiDungKhoaHoc[]>('/khoahoc/tiendo', {
      params: { ma_khoa_hoc: ma_kh, ma_hoc_vien: ma_hv }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải tiến độ học tập');
  }
};

export const updateStudentProgress = async (data: { 
  ma_hoc_vien: string, 
  id_noi_dung: number, 
  trang_thai: 'HOÀN THÀNH' | 'CHƯA HOÀN THÀNH' 
}) => {
  try {
    const response = await apiClient.post('/khoahoc/tiendo/capnhat', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật tiến độ');
  }
};

export const updateCourseModule = async (id_noi_dung: number, data: { ten_noi_dung: string, mo_ta?: string, thu_tu?: number }) => {
  try {
    const response = await apiClient.put(`/khoahoc/noidung/${id_noi_dung}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật nội dung');
  }
};