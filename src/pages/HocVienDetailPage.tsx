import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getHocVienById, HocVien } from '../services/hocvien.service';
import { getCoursesByStudent, StudentCourseHistory } from '../services/dangky.service';

import Notification from '../components/notification/Notification';
import StudentProgressModal from '../components/course/StudentProgressModal';

import '../styles/tables.css'; 
import '../styles/forms.css';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const HocVienDetailPage = () => {
  const { ma_hv } = useParams<{ ma_hv: string }>();
  const navigate = useNavigate();

  const [hocVien, setHocVien] = useState<HocVien | null>(null);
  const [history, setHistory] = useState<StudentCourseHistory[]>([]);
  const [notification, setNotification] = useState<NotificationState>(null);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!ma_hv) return;

    try {
      const [hvData, historyData] = await Promise.all([
        getHocVienById(ma_hv),
        getCoursesByStudent(ma_hv)
      ]);
      
      setHocVien(hvData || null);
      setHistory(historyData || []);

    } catch (err: any) {
      console.error("Lỗi tải dữ liệu:", err);
      setNotification({ message: err.message || 'Không thể tải dữ liệu', type: 'error' });
    }
  }, [ma_hv]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!hocVien) {
     return (
       <div style={{ padding: '20px' }}>
         {notification && (
           <Notification
             message={notification.message}
             type={notification.type}
             onClose={() => setNotification(null)}
           />
         )}
         {!notification && <p>Đang tải hồ sơ học viên...</p>}
         <button 
            className="form-button form-button-secondary" 
            style={{marginTop: '20px'}}
            onClick={() => navigate('/admin/hocvien')}>
            Quay lại danh sách
         </button>
       </div>
     );
  }

  return (
    <div style={{ padding: '20px' }}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div style={{ marginBottom: '30px' }}>
        <button 
          className="form-button form-button-secondary" 
          style={{ marginBottom: '15px' }}
          onClick={() => navigate('/admin/hocvien')}>
          <i className="fa-solid fa-arrow-left" style={{ paddingRight: '10px' }}></i>
          Quay lại danh sách
        </button>
        
        <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>
          Hồ sơ học viên: {hocVien.ho_ten} 
          <span style={{ fontSize: '0.7em', color: '#7f8c8d', marginLeft: '10px' }}>
            ({hocVien.ma_hoc_vien})
          </span>
        </h2>

        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', 
          background: 'rgb(176,224,230)', padding: '15px', borderRadius: '8px',
        }}>
          <div><strong>Ngày sinh:</strong> {hocVien.ngay_sinh ? new Date(hocVien.ngay_sinh).toLocaleDateString('vi-VN') : '---'}</div>
          <div><strong>Quê quán:</strong> {hocVien.ten_tinh_que_quan || '---'}</div>
          <div><strong>Thường trú:</strong> {hocVien.ten_tinh_thuong_tru || '---'}</div>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #ddd', margin: '30px 0' }} />
        
      <h3 style={{ borderLeft: '5px solid #3498db', paddingLeft: '10px', marginBottom: '20px', color: '#2c3e50' }}>
        Lịch sử & Tiến độ học tập
      </h3>

      {history.length === 0 ? (
        <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '5px', color: '#856404' }}>
          Học viên này chưa đăng ký tham gia khóa học nào.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="styled-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Khóa Học</th>
                <th style={{ width: '20%' }}>Thời Gian</th>
                <th style={{ width: '30%' }}>Tiến Độ Bài Học</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Kết Quả</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => {
                const percent = item.tong_so_bai > 0 
                  ? Math.round((item.so_bai_da_hoan_thanh / item.tong_so_bai) * 100) 
                  : 0;

                return (
                  <tr key={item.ma_khoa_hoc}>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#2980b9' }}>{item.ten_khoa}</div>
                      <small style={{ color: '#888' }}>Mã: {item.ma_khoa_hoc}</small>
                    </td>
                    <td>
                      <div>BĐ: {new Date(item.ngay_dang_ky).toLocaleDateString('vi-VN')}</div>
                      {item.thoi_gian_ket_thuc && (
                        <div style={{ color: '#666', fontSize: '0.9em' }}>
                          KT: {new Date(item.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '10px', background: '#e9ecef', borderRadius: '5px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
                          <div style={{ 
                            width: `${percent}%`, 
                            height: '100%', 
                            backgroundColor: percent === 100 ? '#28a745' : percent > 50 ? '#17a2b8' : '#ffc107',
                            transition: 'width 0.6s ease-in-out'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.85em', fontWeight: 'bold', minWidth: '65px', textAlign: 'right' }}>
                          {item.so_bai_da_hoan_thanh}/{item.tong_so_bai} bài
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <span className={`badge ${
                        item.ket_qua === 'ĐẠT' ? 'badge-success' : 
                        item.ket_qua === 'KHÔNG ĐẠT' ? 'badge-danger' : 
                        'badge-warning'
                      }`}>
                        {item.ket_qua}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <button 
                        className="form-button"
                        style={{ 
                          backgroundColor: '#3498db', 
                          padding: '6px 12px', 
                          fontSize: '0.9em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        onClick={() => setSelectedCourseId(item.ma_khoa_hoc)}
                      >
                        <span>Cập nhật</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedCourseId && ma_hv && (
        <StudentProgressModal
          maKhoaHoc={selectedCourseId}
          studentId={ma_hv}
          studentName={hocVien.ho_ten}
          tenKhoaHoc={history.find(h => h.ma_khoa_hoc === selectedCourseId)?.ten_khoa || ''}
          onClose={() => setSelectedCourseId(null)}
          onUpdateSuccess={() => {
             loadData(); 
          }}
        />
      )}

    </div>
  );
};

export default HocVienDetailPage;