import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKhoaHocById, KhoaHoc } from '../services/khoahoc.service';

import CourseContentManager from '../components/course/CourseContentManager';
import Notification from '../components/notification/Notification';


const KhoaHocDetailPage = () => {
  const { ma_kh } = useParams<{ ma_kh: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<KhoaHoc | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!ma_kh) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const courseData = await getKhoaHocById(ma_kh);
        setCourse(courseData);

      } catch (error: any) {
        setNotification({ 
          message: error.message || 'Lỗi tải dữ liệu khóa học', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ma_kh]);

  if (loading) return <div style={{padding: '20px'}}>Đang tải thông tin...</div>;
  if (!course) return <div style={{padding: '20px', color: 'red'}}>Không tìm thấy khóa học!</div>;

  return (
    <div className="detail-page-container" style={{ padding: '20px' }}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="section-header" style={{ marginBottom: '30px' }}>
        <button onClick={() => navigate('/admin/khoahoc')} className="form-button form-button-secondary" style={{ marginBottom: '10px' }}>
          <i className="fa-solid fa-arrow-left" style={{ paddingRight: '10px' }}></i> 
          Quay lại danh sách
        </button>
        
        <h1 style={{ color: '#2c3e50' }}>{course.ten_khoa} 
          <span style={{fontSize: '0.6em', color: '#7f8c8d'}}>({course.ma_khoa_hoc})</span>
        </h1>
        
        <div 
          className="course-info-grid" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            background: 'rgb(176,224,230)', 
            padding: '15px',
            borderRadius: '8px' }}
        >
          <div>
            <strong>Ngày bắt đầu:</strong> {new Date(course.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}
          </div>
          <div>
            <strong>Ngày kết thúc:</strong> {course.thoi_gian_ket_thuc ? new Date(course.thoi_gian_ket_thuc).toLocaleDateString('vi-VN') : 'Chưa xác định'}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <strong>Mô tả sơ lược:</strong> <br/>
            {course.noi_dung || 'Chưa có mô tả'}
          </div>
        </div>
      </div>

      <hr style={{ borderTop: '1px solid #ddd', margin: '30px 0' }} />

      <div className="section-content" style={{ marginBottom: '40px' }}>
        <h2 style={{ borderLeft: '5px solid #3498db', paddingLeft: '10px', marginBottom: '20px' }}>
          Nội dung đào tạo
        </h2>
        {ma_kh && <CourseContentManager maKhoaHoc={ma_kh} />}
      </div>

    </div>
  );
};

export default KhoaHocDetailPage;