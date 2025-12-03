import React, { useEffect, useState } from 'react';
import Select from 'react-select'; //
import '../styles/forms.css';

import { getAllHocVien, HocVien } from '../services/hocvien.service';
import { getAllKhoaHoc, KhoaHoc } from '../services/khoahoc.service';
import { registerStudentToCourse } from '../services/dangky.service';

import Notification from '../components/notification/Notification';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

type SelectOption = {
  value: string;
  label: string;
};

const DangKyPage = () => {
  const [hocVienList, setHocVienList] = useState<HocVien[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);

  const [selectedHocVien, setSelectedHocVien] = useState<string>('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<string>('');

  const [notification, setNotification] = useState<NotificationState>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setNotification(null);
        const [hvData, khData] = await Promise.all([
          getAllHocVien(),
          getAllKhoaHoc()
        ]);
        
        setHocVienList(hvData);
        setKhoaHocList(khData);
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    };
    loadData();
  }, []);

  const hocVienOptions: SelectOption[] = hocVienList.map(hv => ({
    value: hv.ma_hoc_vien,
    label: `${hv.ho_ten} (${hv.ma_hoc_vien})`
  }));

  const khoaHocOptions: SelectOption[] = khoaHocList.map(kh => ({
    value: kh.ma_khoa_hoc,
    label: `${kh.ten_khoa} (${kh.ma_khoa_hoc})`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); 

    if (!selectedHocVien || !selectedKhoaHoc) {
      setNotification({ message: 'Vui lòng chọn cả học viên và khóa học', type: 'error' });
      return;
    }

    try {
      const data = {
        ma_hoc_vien: selectedHocVien,
        ma_khoa_hoc: selectedKhoaHoc
      };
      await registerStudentToCourse(data); 

      setNotification({ message: 'Ghi danh học viên thành công!', type: 'success' });
      
      setSelectedHocVien('');
      setSelectedKhoaHoc('');
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2>Đăng Ký Học Viên Vào Khóa Học</h2>
      
      <form onSubmit={handleSubmit} className="form-container">
        
        <div className="form-group">
          <label className="form-label">Chọn học viên:</label>
          <Select
            options={hocVienOptions}
            value={hocVienOptions.find(opt => opt.value === selectedHocVien)}
            onChange={(opt) => setSelectedHocVien(opt ? opt.value : '')}
            placeholder="-- Chọn hoặc tìm kiếm học viên --"
            isClearable
            isSearchable
            maxMenuHeight={200}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Chọn khóa học:</label>
          <Select
            options={khoaHocOptions}
            value={khoaHocOptions.find(opt => opt.value === selectedKhoaHoc)}
            onChange={(opt) => setSelectedKhoaHoc(opt ? opt.value : '')}
            placeholder="-- Chọn hoặc tìm kiếm khóa học --"
            isClearable
            isSearchable
            maxMenuHeight={200}
          />
        </div>

        <button type="submit" className="form-button">Đăng ký</button>
      </form>
    </div>
  );
};

export default DangKyPage;