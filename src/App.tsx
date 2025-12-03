/*
 * File: App.tsx
 * Đây là file "Bản đồ" (Router) chính của ứng dụng Frontend.
 * Nhiệm vụ:
 * 1. Định nghĩa tất cả các "trang" (đường dẫn) của ứng dụng.
 * 2. Sử dụng 'ProtectedRoute' để bảo vệ các trang quản trị (yêu cầu đăng nhập).
 * 3. Sử dụng 'AdminLayout' để áp dụng bố cục (Sidebar/Header) chung cho các trang quản trị.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. IMPORT CÁC COMPONENT BỐ CỤC (LAYOUT) ---
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute'; // "Gác cổng" kiểm tra đăng nhập
import AdminLayout from './components/layout/AdminLayout'; // Bố cục (Sidebar + Header)

// --- 2. IMPORT CÁC TRANG (PAGES) ---
import DashboardPage from './pages/DashboardPage';
import HocVienPage from './pages/HocVienPage';
import HocVienDetailPage from './pages/HocVienDetailPage';
import KhoaHocPage from './pages/KhoaHocPage';
import KhoaHocDetailPage from './pages/KhoaHocDetailPage';
import DangKyPage from './pages/DangKyPage';
import CapNhatKetQuaPage from './pages/CapNhatKetQuaPage';
// import ThongKePage from './pages/ThongKePage';
import QuanLyTaiKhoanPage from './pages/QuanLyTaiKhoanPage';

import ThongKeQueQuanPage from './pages/ThongKeQueQuanPage';
import ThongKeThuongTruPage from './pages/ThongKeThuongTruPage';
import ThongKeKhoaHocPage from './pages/ThongKeKhoaHocPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- TRANG CÔNG KHAI (PUBLIC) --- */}
        {/* Ai cũng có thể truy cập trang Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- TRANG ĐƯỢC BẢO VỆ (PRIVATE) --- */}
        {/* * Tất cả các route bên trong <ProtectedRoute> sẽ bị "gác cổng".
         * Nếu chưa đăng nhập, người dùng sẽ bị đá về '/login'.
         */}
        <Route element={<ProtectedRoute />}>
          
          {/* * Tất cả các route bên trong <AdminLayout> sẽ có chung bố cục
           * (Sidebar, Header, Nút Đăng xuất).
           * Component trang con sẽ được render vào <Outlet /> của AdminLayout.
           */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* * 3. Các Trang Con (Admin Pages)
             * (path="dashboard" sẽ được tự động nối với path="/admin" 
             * để tạo thành /admin/dashboard)
             */}
            
            {/* Trang Tổng quan */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Module Học Viên */}
            <Route path="hocvien" element={<HocVienPage />} />
            <Route path="hocvien/:ma_hv" element={<HocVienDetailPage />} />
            
            {/* Module Khóa Học */}
            <Route path="khoahoc" element={<KhoaHocPage />} />
            <Route path="khoahoc/:ma_kh" element={<KhoaHocDetailPage />} />
            
            {/* Module Nghiệp Vụ */}
            <Route path="dangky" element={<DangKyPage />} />
            <Route path="ketqua" element={<CapNhatKetQuaPage />} />
            
            {/* Module Báo Cáo & Quản Trị */}
            {/* <Route path="thongke" element={<ThongKePage />} /> */}

            {/* 3. THÊM 3 ROUTE MỚI */}
            <Route path="thongke/que-quan" element={<ThongKeQueQuanPage />} />
            <Route path="thongke/thuong-tru" element={<ThongKeThuongTruPage />} />
            <Route path="thongke/khoa-hoc" element={<ThongKeKhoaHocPage />} />

            <Route path="taikhoan" element={<QuanLyTaiKhoanPage />} />

            {/* * Route Mặc Định (Index)
             * Nếu người dùng truy cập /admin (không có gì phía sau),
             * tự động chuyển hướng họ đến trang "dashboard".
             */}
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        
        </Route>

        {/* --- ROUTE GỐC (FALLBACK) --- */}
        {/* * Nếu người dùng truy cập vào "/" (trang chủ),
         * tự động chuyển hướng họ đến "/login".
         */}
        <Route path="/" element={<Navigate to="/login" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;