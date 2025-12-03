// File: src/services/khoahoc.service.ts
import apiClient from './api';

// ==========================================
// 1. CÁC INTERFACE (KIỂU DỮ LIỆU)
// ==========================================

// Kiểu dữ liệu cho Khóa Học
export interface KhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  deleted_at: string | null;
}

// Kiểu dữ liệu cho Form nhập liệu Khóa Học
export type KhoaHocFormData = {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
};

// Kiểu dữ liệu cho Nội dung/Chương của khóa học
export interface NoiDungKhoaHoc {
  id: number;
  ma_khoa_hoc: string;
  ten_noi_dung: string;
  mo_ta: string;
  thu_tu: number;
  // Trường này có thể null nếu chỉ lấy danh sách chung, 
  // nhưng sẽ có giá trị khi gọi API xem tiến độ của học viên
  trang_thai?: 'HOÀN THÀNH' | 'CHƯA HOÀN THÀNH'; 
}

// ==========================================
// 2. CÁC API QUẢN LÝ KHÓA HỌC (CRUD CƠ BẢN)
// ==========================================

// Lấy tất cả khóa học
export const getAllKhoaHoc = async () => {
  try {
    const response = await apiClient.get<KhoaHoc[]>('/khoahoc');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải danh sách khóa học');
  }
};

// Lấy chi tiết 1 khóa học
export const getKhoaHocById = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<KhoaHoc>(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải chi tiết khóa học');
  }
};

// Tạo khóa học mới
export const createKhoaHoc = async (data: KhoaHocFormData) => {
  try {
    const response = await apiClient.post('/khoahoc', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tạo khóa học');
  }
};

// Cập nhật khóa học
export const updateKhoaHoc = async (ma_kh: string, data: KhoaHocFormData) => {
  try {
    const response = await apiClient.put(`/khoahoc/${ma_kh}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật khóa học');
  }
};

// Xóa (mềm) khóa học
export const deleteKhoaHoc = async (ma_kh: string) => {
  try {
    const response = await apiClient.delete(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa khóa học');
  }
};

// ==========================================
// 3. CÁC API QUẢN LÝ NỘI DUNG & TIẾN ĐỘ (MỚI)
// ==========================================

// Lấy danh sách các chương/bài học của 1 khóa (Dùng cho admin quản lý nội dung)
export const getCourseModules = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<NoiDungKhoaHoc[]>(`/khoahoc/${ma_kh}/noidung`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải nội dung khóa học');
  }
};

// Thêm một chương/bài học mới vào khóa
export const addCourseModule = async (ma_kh: string, data: { ten_noi_dung: string, mo_ta?: string, thu_tu?: number }) => {
  try {
    const response = await apiClient.post(`/khoahoc/${ma_kh}/noidung`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi thêm nội dung');
  }
};

// Xóa một chương/bài học
export const deleteCourseModule = async (id_noi_dung: number) => {
  try {
    const response = await apiClient.delete(`/khoahoc/noidung/${id_noi_dung}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi xóa nội dung');
  }
};

// (QUAN TRỌNG) Lấy danh sách bài học KÈM THEO trạng thái của học viên
// Dùng để hiển thị trong Modal Checklist
export const getStudentProgress = async (ma_kh: string, ma_hv: string) => {
  try {
    // Gọi API: /api/khoahoc/tiendo?ma_khoa_hoc=...&ma_hoc_vien=...
    const response = await apiClient.get<NoiDungKhoaHoc[]>('/khoahoc/tiendo', {
      params: { ma_khoa_hoc: ma_kh, ma_hoc_vien: ma_hv }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải tiến độ học tập');
  }
};

// (QUAN TRỌNG) Cập nhật trạng thái checkbox (Hoàn thành / Chưa hoàn thành)
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

// ... (các hàm cũ) ...

// [MỚI] Cập nhật nội dung chương học
export const updateCourseModule = async (id_noi_dung: number, data: { ten_noi_dung: string, mo_ta?: string, thu_tu?: number }) => {
  try {
    const response = await apiClient.put(`/khoahoc/noidung/${id_noi_dung}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi cập nhật nội dung');
  }
};