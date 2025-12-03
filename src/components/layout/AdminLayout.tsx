// File: src/components/layout/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isThongKeOpen, setIsThongKeOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('username'); 
    setUserRole(role);
    setUsername(storedName);
  }, []);

  const toggleThongKe = () => {
    setIsThongKeOpen(!isThongKeOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // --- Kiểm tra highlight menu cha ---
  const thongKeChildPaths = [
    "/admin/thongke/que-quan",
    "/admin/thongke/thuong-tru",
    "/admin/thongke/khoa-hoc"
  ];
  const isThongKeActive = thongKeChildPaths.includes(location.pathname);

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src="/logo_quan_ly_trung_tam.png" alt="Logo" className="sidebar-logo" />
          <span>Quản lý trung tâm</span>
        </div>
        
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/admin/dashboard">
              <i className="fas fa-home"></i>
              <span>Trang chủ</span>
            </NavLink>
          </li>

          {userRole === 'ADMIN' && (
            <>
              <li>
                <NavLink to="/admin/khoahoc">
                  <i className="fas fa-book"></i>
                  <span>Quản lý khóa học</span>
                </NavLink>
              </li>

              {/* Menu cha Báo cáo thống kê */}
              <li>
                <div 
                  className={`sidebar-dropdown-toggle ${isThongKeActive ? 'active' : ''}`} 
                  onClick={toggleThongKe}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-chart-pie"></i>
                    <span>Báo cáo thống kê</span>
                  </div>
                  <i className={`fas fa-chevron-right arrow ${isThongKeOpen ? 'rotate' : ''}`}></i>
                </div>

                {/* Menu con: mở/đóng theo click */}
                {isThongKeOpen && (
                  <ul className="sidebar-submenu">
                    <li>
                      <NavLink to="/admin/thongke/que-quan">
                        <i className="fas fa-map"></i>
                        <span>Theo Quê quán</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/thongke/thuong-tru">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Theo Thường trú</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/thongke/khoa-hoc">
                        <i className="fas fa-book-open"></i>
                        <span>Theo Khóa học</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink to="/admin/taikhoan">
                  <i className="fas fa-users"></i>
                  <span>Quản lý tài khoản</span>
                </NavLink>
              </li>
            </>
          )}

          {userRole === 'STAFF' && (
            <>
              <li>
                <NavLink to="/admin/hocvien">
                  <i className="fas fa-user-graduate"></i>
                  <span>Quản lý học viên</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/dangky">
                  <i className="fas fa-edit"></i>
                  <span>Đăng ký khoá học</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ketqua">
                  <i className="fas fa-tasks"></i>
                  <span>Cập nhật Kết quả</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* NỘI DUNG CHÍNH */}
      <div className="main-content">
        <header className="header">
          <div className="welcome-message">
            Xin chào, <strong>{username || 'Người dùng'}</strong>
          </div>
          <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
