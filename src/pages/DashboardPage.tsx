import React, { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '../services/thongke.service';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <h1>Tổng quan</h1>
      <p>Chào mừng bạn đến với trang quản trị.</p>

      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {stats ? (
        <div className="stat-cards-container">
          <div className="stat-card">
            <h4>Tổng số Học viên</h4>
            <p>{stats.totalHocVien}</p>
          </div>
          <div className="stat-card green">
            <h4>Tổng số Khóa học</h4>
            <p>{stats.totalKhoaHoc}</p>
          </div>
          <div className="stat-card orange">
            <h4>Tổng số Lượt Đăng ký</h4>
            <p>{stats.totalDangKy}</p>
          </div>
        </div>
      ) : (
        <p>Đang tải số liệu thống kê...</p>
      )}
      
    </div>
  );
};

export default DashboardPage;