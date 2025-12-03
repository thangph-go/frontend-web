import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';
import '../styles/tables.css';

import {
  getAllKhoaHoc,
  createKhoaHoc,
  updateKhoaHoc,
  deleteKhoaHoc,
  KhoaHoc,
  KhoaHocFormData,
} from '../services/khoahoc.service';

import Notification from '../components/notification/Notification';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const initialFormState: KhoaHocFormData = {
  ma_khoa_hoc: '',
  ten_khoa: '',
  noi_dung: '',
  thoi_gian_bat_dau: '',
  thoi_gian_ket_thuc: '',
};


const KhoaHocPage = () => {
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<KhoaHocFormData>(initialFormState);
  const [editingMaKH, setEditingMaKH] = useState<string | null>(null);

  const [notification, setNotification] = useState<NotificationState>(null);
  
  const navigate = useNavigate();

  const loadKhoaHoc = async () => {
    try {
      const data = await getAllKhoaHoc();
      setKhoaHocList(data);
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  useEffect(() => {
    loadKhoaHoc();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setEditingMaKH(null);
    setNotification(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); 

    try {
      if (editingMaKH) {
        await updateKhoaHoc(editingMaKH, formData);
        setNotification({ message: 'Cập nhật khóa học thành công!', type: 'success' });
      } else {
        await createKhoaHoc(formData);

        setNotification({ message: 'Thêm khóa học thành công!', type: 'success' });
      }
      
      setShowForm(false);
      setFormData(initialFormState);
      setEditingMaKH(null);
      loadKhoaHoc();
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  const handleEditClick = (kh: KhoaHoc) => {
    setNotification(null); 
    setEditingMaKH(kh.ma_khoa_hoc);
    setFormData({
      ma_khoa_hoc: kh.ma_khoa_hoc,
      ten_khoa: kh.ten_khoa,
      noi_dung: kh.noi_dung,
      thoi_gian_bat_dau: (kh.thoi_gian_bat_dau || '').split('T')[0],
      thoi_gian_ket_thuc: (kh.thoi_gian_ket_thuc || '').split('T')[0],
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (ma_kh: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        setNotification(null);
        await deleteKhoaHoc(ma_kh);
        setNotification({ message: 'Xóa khóa học thành công!', type: 'success' });
        loadKhoaHoc();
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    }
  };

  // --- Giao Diện (JSX) ---
  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2>Quản lý khóa học</h2>
      

      {!showForm && (
        <button 
          className="form-button"
          onClick={() => {
            handleCancel(); 
            setShowForm(true);
          }}>Thêm khóa học mới</button>
      )}

      {/* Form Thêm Mới / Cập Nhật */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h3>{editingMaKH ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}</h3>
          
          <div className="form-group">
            <label className="form-label">Mã khóa học:</label>
            <input
              type="text"
              name="ma_khoa_hoc"
              className="form-input"
              value={formData.ma_khoa_hoc}
              onChange={handleInputChange}
              required
              disabled={!!editingMaKH}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tên khóa học:</label>
            <input
              type="text"
              name="ten_khoa"
              className="form-input"
              value={formData.ten_khoa}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả sơ lược:</label>
            <textarea
              name="noi_dung"
              className="form-textarea"
              value={formData.noi_dung}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thời gian bắt đầu:</label>
            <input
              type="date"
              name="thoi_gian_bat_dau"
              className="form-input"
              value={formData.thoi_gian_bat_dau}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thời gian kết thúc:</label>
            <input
              type="date"
              name="thoi_gian_ket_thuc"
              className="form-input"
              value={formData.thoi_gian_ket_thuc}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <button type="submit" className="form-button">Lưu</button>
            <button type="button" onClick={handleCancel} className="form-button form-button-secondary">Hủy</button>
          </div>
        </form>
      )}

      {/* Danh sách Khóa học (Bảng) */}
      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
      <h3>Danh sách khóa học</h3>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Mã Khóa Học</th>
            <th>Tên Khóa Học</th>
            <th>Bắt Đầu</th>
            <th>Kết Thúc</th>
            <th style={{width: '250px'}}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {khoaHocList.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                Không tìm thấy khóa học nào.
              </td>
            </tr>
          ) : (
            khoaHocList.map((kh) => (
              <tr key={kh.ma_khoa_hoc}>
                <td>{kh.ma_khoa_hoc}</td>
                <td>{kh.ten_khoa}</td>
                <td>
                  {kh.thoi_gian_bat_dau 
                    ? new Date(kh.thoi_gian_bat_dau).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric' 
                      }) 
                    : '(Chưa có)'}
                </td>
                <td>
                  {kh.thoi_gian_ket_thuc 
                    ? new Date(kh.thoi_gian_ket_thuc).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric' 
                      }) 
                    : '(Chưa có)'}
                </td>
                
                <td>
                  <button 
                    onClick={() => navigate(`/admin/khoahoc/${kh.ma_khoa_hoc}`)} 
                    className="form-button"
                    style={{marginRight: '5px', padding: '5px 10px'}}
                  >
                    Chi tiết
                  </button>
                  <button 
                    onClick={() => handleEditClick(kh)} 
                    className="form-button form-button-secondary"
                    style={{marginRight: '5px', padding: '5px 10px'}}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(kh.ma_khoa_hoc)} 
                    className="form-button" 
                    style={{backgroundColor: '#e74c3c', padding: '5px 10px'}}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KhoaHocPage;