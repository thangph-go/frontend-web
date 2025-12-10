import apiClient from './api';

export interface HocVien {
  ma_hoc_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
  deleted_at: string | null;
  ten_tinh_que_quan: string | null;
  ten_tinh_thuong_tru: string | null; 
}

type HocVienDTO = {
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
};

export const getAllHocVien = async () => {
  try {
    const response = await apiClient.get<HocVien[]>('/hocvien');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const getHocVienById = async (ma_hv: string) => {
  try {
    const response = await apiClient.get<HocVien>(`/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải chi tiết học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const searchHocVien = async (query: string) => {
  try {
    const response = await apiClient.get<HocVien[]>('/hocvien/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tìm kiếm học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const createHocVien = async (hocVienData: HocVienDTO) => {
  try {
    const response = await apiClient.post('/hocvien', hocVienData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tạo học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const updateHocVien = async (ma_hv: string, hocVienData: HocVienDTO) => {
  try {
    const response = await apiClient.put(`/hocvien/${ma_hv}`, hocVienData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi cập nhật học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

export const deleteHocVien = async (ma_hv: string) => {
  try {
    const response = await apiClient.delete(`/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi xóa học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};