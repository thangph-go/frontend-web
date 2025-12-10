import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import DashboardPage from './pages/DashboardPage';
import HocVienPage from './pages/HocVienPage';
import HocVienDetailPage from './pages/HocVienDetailPage';
import KhoaHocPage from './pages/KhoaHocPage';
import KhoaHocDetailPage from './pages/KhoaHocDetailPage';
import DangKyPage from './pages/DangKyPage';
import CapNhatKetQuaPage from './pages/CapNhatKetQuaPage';
import QuanLyTaiKhoanPage from './pages/QuanLyTaiKhoanPage';
import ThongKeQueQuanPage from './pages/ThongKeQueQuanPage';
import ThongKeThuongTruPage from './pages/ThongKeThuongTruPage';
import ThongKeKhoaHocPage from './pages/ThongKeKhoaHocPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          
          <Route path="/admin" element={<AdminLayout />}>
            
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="hocvien" element={<HocVienPage />} />
            <Route path="hocvien/:ma_hv" element={<HocVienDetailPage />} />
            <Route path="khoahoc" element={<KhoaHocPage />} />
            <Route path="khoahoc/:ma_kh" element={<KhoaHocDetailPage />} />
            <Route path="dangky" element={<DangKyPage />} />
            <Route path="ketqua" element={<CapNhatKetQuaPage />} />
            <Route path="thongke/que-quan" element={<ThongKeQueQuanPage />} />
            <Route path="thongke/thuong-tru" element={<ThongKeThuongTruPage />} />
            <Route path="thongke/khoa-hoc" element={<ThongKeKhoaHocPage />} />
            <Route path="taikhoan" element={<QuanLyTaiKhoanPage />} />

            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;