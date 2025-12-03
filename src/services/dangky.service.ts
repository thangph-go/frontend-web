// File: src/services/dangky.service.ts
import apiClient from './api';

// ==========================================
// 1. CÁC INTERFACE (KIỂU DỮ LIỆU)
// ==========================================

/**
 * Interface cho thông tin học viên trong danh sách đăng ký
 * (Dùng cho trang Cấp chứng chỉ)
 */
export interface EnrollmentInfo {
  ma_hoc_vien: string;
  ho_ten: string;
  ket_qua: 'ĐẠT' | 'KHÔNG ĐẠT' | 'CHƯA CẬP NHẬT';
  ngay_dang_ky?: string; // Có thể bổ sung thêm nếu cần hiển thị
}


// Interface cho Lịch sử khóa học của học viên
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

/**
 * Dữ liệu gửi đi khi GHI DANH (Đăng ký mới)
 */
type RegisterDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
};

/**
 * Dữ liệu gửi đi khi CẬP NHẬT KẾT QUẢ (Cấp chứng chỉ)
 */
type UpdateResultDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
  ket_qua: 'ĐẠT' | 'KHÔNG ĐẠT' | 'CHƯA CẬP NHẬT';
};

// ==========================================
// 2. CÁC HÀM GỌI API NGHIỆP VỤ ĐĂNG KÝ
// ==========================================

/**
 * Ghi danh học viên vào khóa học
 * API: POST /api/dangky
 */
export const registerStudentToCourse = async (data: RegisterDTO) => {
  try {
    const response = await apiClient.post('/dangky', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Trả về lỗi cụ thể từ Backend (ví dụ: "Học viên đã đăng ký rồi")
      throw new Error(error.response.data.error || 'Lỗi khi đăng ký khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * Cập nhật kết quả cuối khóa (ĐẠT / KHÔNG ĐẠT)
 * API: PUT /api/dangky
 */
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

/**
 * Lấy danh sách học viên ĐỦ ĐIỀU KIỆN cấp chứng chỉ
 * (Backend đã lọc: chỉ trả về học viên hoàn thành 100% bài học)
 * API: GET /api/dangky/khoahoc/:ma_kh
 */// 1. Hàm lấy TẤT CẢ (Dùng cho KhoaHocDetailPage.tsx)
export const getEnrollmentsByCourse = async (ma_kh: string) => {
  try {
    // Gọi route cũ /khoahoc/:ma_kh -> Backend trả về tất cả
    const response = await apiClient.get<EnrollmentInfo[]>(`/dangky/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi tải danh sách');
  }
};

// 2. Hàm lấy ĐỦ ĐIỀU KIỆN (Dùng cho CapNhatKetQuaPage.tsx)
export const getEligibleStudents = async (ma_kh: string) => {
  try {
    // Gọi route mới /du-dieu-kien/:ma_kh
    const response = await apiClient.get<EnrollmentInfo[]>(`/dangky/du-dieu-kien/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi tải danh sách đủ điều kiện');
  }
};

// (MỚI) Lấy danh sách khóa học đã đăng ký của 1 học viên
export const getCoursesByStudent = async (ma_hv: string) => {
  try {
    const response = await apiClient.get<StudentCourseHistory[]>(`/dangky/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Lỗi khi tải lịch sử học tập');
  }
};