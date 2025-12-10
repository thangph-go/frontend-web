import apiClient from './api';

export interface DashboardStats {
  totalHocVien: number;
  totalKhoaHoc: number;
  totalDangKy: number;
}

export interface StatsQueQuan {
  ma_tinh_que_quan: string;
  ten_tinh: string;
  so_luong: number;
}

export interface StatsThuongTru {
  ma_tinh_thuong_tru: string;
  ten_tinh: string;
  so_luong: number;
}

export interface StatsKhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  so_luong_hoc_vien: number;
  so_luong_dat: number;
  so_luong_khong_dat: number;
}

export interface StudentHistory {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  ngay_dang_ky: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
}

export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get<DashboardStats>('/thongke/dashboard');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê dashboard');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getStatsByHometown = async () => {
  try {
    const response = await apiClient.get<StatsQueQuan[]>('/thongke/quequan');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê quê quán');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getStatsByThuongTru = async () => {
  try {
    const response = await apiClient.get<StatsThuongTru[]>('/thongke/thuongtru');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê thường trú');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getStatsByCourse = async (year: number) => {
  try {
    const response = await apiClient.get<StatsKhoaHoc[]>('/thongke/khoahoc', {
      params: { year }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getStudentHistory = async (ma_hv: string) => {
    try {
      const response = await apiClient.get<StudentHistory[]>(`/thongke/lichsuhocvien/${ma_hv}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Lỗi khi tải lịch sử học viên');
      } else {
        throw new Error('Không thể kết nối đến máy chủ.');
      }
    }
  };