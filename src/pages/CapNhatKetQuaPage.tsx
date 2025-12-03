import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import '../styles/forms.css';
import '../styles/tables.css';

import { getAllKhoaHoc, KhoaHoc } from '../services/khoahoc.service';
import { 
  getEligibleStudents, 
  updateEnrollmentResult, 
  EnrollmentInfo 
} from '../services/dangky.service';

import Notification from '../components/notification/Notification';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

type SelectOption = { value: string; label: string; };

const RESULT_OPTIONS: SelectOption[] = [
  { value: 'CHƯA CẬP NHẬT', label: 'Chưa Cập Nhật' },
  { value: 'ĐẠT', label: 'Đạt' },
  { value: 'KHÔNG ĐẠT', label: 'Không Đạt' }
];

const CapNhatKetQuaPage = () => {
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<string>('');
  const [enrollments, setEnrollments] = useState<EnrollmentInfo[]>([]);
  
  const [notification, setNotification] = useState<NotificationState>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadKhoaHoc = async () => {
      try {
        const data = await getAllKhoaHoc();
        setKhoaHocList(data);
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    };
    loadKhoaHoc();
  }, []);

  const khoaHocOptions: SelectOption[] = khoaHocList.map(kh => ({
    value: kh.ma_khoa_hoc,
    label: `${kh.ten_khoa} (${kh.ma_khoa_hoc})`
  }));

  const handleCourseSelect = async (ma_kh: string) => {
    setSelectedKhoaHoc(ma_kh);
    setNotification(null);
    setEnrollments([]); 

    if (!ma_kh) return;

    setLoading(true);
    try {
      const data = await getEligibleStudents(ma_kh); 
      setEnrollments(data);
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleResultChange = async (ma_hv: string, new_ket_qua: string) => {
    if (!['ĐẠT', 'KHÔNG ĐẠT', 'CHƯA CẬP NHẬT'].includes(new_ket_qua)) return;

    try {
      await updateEnrollmentResult({
        ma_hoc_vien: ma_hv,
        ma_khoa_hoc: selectedKhoaHoc,
        ket_qua: new_ket_qua as any
      });

      setEnrollments(prevList => 
        prevList.map(item => 
          item.ma_hoc_vien === ma_hv 
            ? { ...item, ket_qua: new_ket_qua as any } 
            : item
        )
      );
      setNotification({ message: 'Cập nhật kết quả thành công!', type: 'success' });

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
      
      <h2>Cập nhật Kết quả (Cấp chứng chỉ)</h2>
      
      <div className="form-container" style={{padding: '15px'}}>
        <div className="form-group">
          <label className="form-label">Chọn khóa học để cập nhật:</label>
          <Select
            options={khoaHocOptions}
            value={khoaHocOptions.find(opt => opt.value === selectedKhoaHoc)}
            onChange={(opt) => handleCourseSelect(opt ? opt.value : '')}
            placeholder="-- Tìm kiếm và chọn khóa học --"
            isClearable
            isSearchable
            maxMenuHeight={250}
            classNamePrefix="select"
          />
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
      
      {loading && <p>Đang tải danh sách học viên...</p>}

      {!loading && selectedKhoaHoc && (
        <table className="styled-table" >
          <thead>
            <tr>
              <th>Mã Học Viên</th>
              <th>Tên Học Viên</th>
              <th style={{ width: '250px' }}>Kết Quả (Đạt/Không Đạt)</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  Không có học viên nào trong khóa học này.
                </td>
              </tr>
            ) : (
              enrollments.map((item) => (
                <tr key={item.ma_hoc_vien}>
                  <td>{item.ma_hoc_vien}</td>
                  <td>{item.ho_ten}</td>
                  <td>
                    <Select
                      options={RESULT_OPTIONS}
                      value={RESULT_OPTIONS.find(opt => opt.value === item.ket_qua)}
                      onChange={(opt) => {
                        if (opt) handleResultChange(item.ma_hoc_vien, opt.value);
                      }}
                      menuPortalTarget={document.body}
                      isSearchable={false}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CapNhatKetQuaPage;