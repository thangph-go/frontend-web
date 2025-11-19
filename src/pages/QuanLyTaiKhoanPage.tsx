// File: src/pages/QuanLyTaiKhoanPage.tsx
import React, { useEffect, useState } from 'react';

// Import CSS cho Bảng
import '../styles/tables.css';

// Import Service và Interface
import { getAllAccounts, TaiKhoan } from '../services/taikhoan.service';

// Import component Thông báo (Notification)
import Notification from '../components/common/Notification';

// Kiểu cho State Thông báo
type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const QuanLyTaiKhoanPage = () => {
  // --- STATE ---
  const [accountList, setAccountList] = useState<TaiKhoan[]>([]);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- TẢI DỮ LIỆU KHI MỞ TRANG ---
  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      setNotification(null);
      try {
        const data = await getAllAccounts();
        setAccountList(data);
      } catch (err: any) {
        // Lỗi 403 (Forbidden) sẽ bị bắt ở đây
        setNotification({ message: err.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []); // [] = Chạy 1 lần

  // --- GIAO DIỆN (JSX) ---
  return (
    <div>
      {/* Component Thông báo */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2>Quản lý Tài khoản</h2>
      <p>Danh sách các tài khoản đang hoạt động trong hệ thống.</p>

      {/* Bảng Danh sách Tài khoản */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Đăng Nhập</th>
            <th>Vai Trò</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={3} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
          ) : accountList.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                Không tìm thấy tài khoản nào (hoặc bạn không có quyền xem).
              </td>
            </tr>
          ) : (
            accountList.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.id}</td>
                <td>{acc.ten_dang_nhap}</td>
                <td>{acc.vai_tro}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuanLyTaiKhoanPage;