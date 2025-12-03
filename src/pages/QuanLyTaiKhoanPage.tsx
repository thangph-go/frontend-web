import React, { useEffect, useState } from 'react';
import '../styles/tables.css';
import '../styles/forms.css';
import '../styles/QuanLyTaiKhoanPage.css'; 

import { 
  getAllAccounts, 
  createStaffAccount, 
  TaiKhoan, 
  CreateStaffDTO 
} from '../services/taikhoan.service';
import Notification from '../components/notification/Notification';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const QuanLyTaiKhoanPage = () => {
  const [accountList, setAccountList] = useState<TaiKhoan[]>([]);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<CreateStaffDTO>({
    ten_dang_nhap: '',
    mat_khau: ''
  });
  const [confirmPass, setConfirmPass] = useState('');

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAccounts();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setAccountList(sortedData);
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ ten_dang_nhap: '', mat_khau: '' });
    setConfirmPass('');
    setNotification(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (formData.mat_khau !== confirmPass) {
      setNotification({ message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }

    const isDuplicate = accountList.some(
      acc => acc.ten_dang_nhap.toLowerCase() === formData.ten_dang_nhap.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setNotification({ message: 'Tên đăng nhập đã tồn tại!', type: 'error' });
      return;
    }

    setIsCreating(true);
    try {
      await createStaffAccount(formData);
      
      await loadAccounts();
      
      setNotification({ message: 'Tạo tài khoản STAFF thành công!', type: 'success' });
      handleCloseModal();
      
    } catch (err: any) {
      setNotification({ message: err.message || 'Lỗi khi tạo tài khoản', type: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const getBadgeClass = (role: string) => {
    return role === 'ADMIN' ? 'badge-danger' : 'badge-success';
  };

  return (
    <div className="qltk-container">

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="qltk-title">Quản lý Tài khoản</h2>

      <div className="qltk-header">
        <p className="qltk-subtitle">Danh sách tài khoản hệ thống.</p>

        <button 
          className="form-button qltk-add-btn"
          onClick={() => setShowModal(true)}
        >
          Thêm Nhân Viên
        </button>
      </div>

      <hr className="qltk-divider" />

      <div className="table-responsive">
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
              <tr>
                <td colSpan={3} className="qltk-center">Đang tải...</td>
              </tr>
            ) : accountList.length === 0 ? (
              <tr>
                <td colSpan={3} className="qltk-center">Trống.</td>
              </tr>
            ) : (
              accountList.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.id}</td>
                  <td><strong>{acc.ten_dang_nhap}</strong></td>
                  <td>
                    <span className={`badge ${getBadgeClass(acc.vai_tro)}`}>
                      {acc.vai_tro}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="qltk-modal-overlay">
          <div className="qltk-modal">

            <div className="qltk-modal-header">
              <h3>Tạo Tài Khoản Nhân viên</h3>
              <button 
                className="qltk-close-btn"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="qltk-form">

              <div>
                <label className="form-label">Tên đăng nhập 
                  <span style={{color: '#CC3300'}}>*</span>
                </label>
                <input 
                  required 
                  name="ten_dang_nhap"
                  className="form-input"
                  value={formData.ten_dang_nhap}
                  onChange={handleInputChange}
                  placeholder="VD: nhanvien01"
                />
              </div>

              <div>
                <label className="form-label">Mật khẩu 
                  <span style={{color: '#CC3300'}}>*</span>
                </label>
                <input 
                  required 
                  type="password"
                  name="mat_khau"
                  className="form-input"
                  value={formData.mat_khau}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="form-label">Xác nhận mật khẩu 
                  <span style={{color: '#CC3300'}}>*</span>
                </label>
                <input 
                  required 
                  type="password"
                  className="form-input"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>

              <div className="qltk-form-footer">
                <button 
                  type="button"
                  className="form-button form-button-secondary"
                  onClick={handleCloseModal}
                  disabled={isCreating}
                >
                  Hủy
                </button>

                <button 
                  type="submit"
                  className="form-button qltk-confirm-btn"
                  disabled={isCreating}
                >
                  {isCreating ? 'Đang tạo...' : 'Xác nhận'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuanLyTaiKhoanPage;