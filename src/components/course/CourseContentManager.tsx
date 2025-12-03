// File: src/components/course/CourseContentManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  getCourseModules, 
  addCourseModule, 
  deleteCourseModule, 
  updateCourseModule, 
  NoiDungKhoaHoc 
} from '../../services/khoahoc.service';

// 1. Import Notification Component
import Notification from '../notification/Notification';
import "../../styles/forms.css"
import "../../styles/tables.css"

interface Props {
  maKhoaHoc: string;
}

const CourseContentManager: React.FC<Props> = ({ maKhoaHoc }) => {
  const [modules, setModules] = useState<NoiDungKhoaHoc[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State cho Form
  const [tenNoiDung, setTenNoiDung] = useState('');
  const [moTa, setMoTa] = useState('');
  const [thuTu, setThuTu] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 2. State quản lý thông báo Popup
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

// --- 2. SỬA HÀM fetchData DÙNG useCallback ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourseModules(maKhoaHoc);
      setModules(data);
      setThuTu(data.length + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [maKhoaHoc]); // Chỉ tạo lại hàm khi maKhoaHoc thay đổi
  // ---------------------------------------------

  // --- 3. SỬA USE EFFECT ---
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Bây giờ an toàn để đưa fetchData vào đây
  // -------------------------

  const resetForm = () => {
    setTenNoiDung('');
    setMoTa('');
    setThuTu(modules.length + 1);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); // Reset thông báo cũ

    // Validate dữ liệu
    if (!tenNoiDung.trim()) {
      setNotification({ message: "Vui lòng nhập tên nội dung!", type: 'error' });
      return;
    }

    // Kiểm tra trùng lặp thứ tự
    const isDuplicate = modules.some(m => m.thu_tu === thuTu && m.id !== editingId);
    if (isDuplicate) {
      setNotification({ message: `Thứ tự số ${thuTu} đã tồn tại! Vui lòng chọn số khác.`, type: 'error' });
      return;
    }

    try {
      if (editingId) {
        // --- Cập nhật ---
        await updateCourseModule(editingId, {
          ten_noi_dung: tenNoiDung,
          mo_ta: moTa,
          thu_tu: thuTu
        });
        // 3. Hiển thị Popup thành công thay vì alert
        setNotification({ message: "Cập nhật nội dung thành công!", type: 'success' });
      } else {
        // --- Thêm mới ---
        await addCourseModule(maKhoaHoc, {
          ten_noi_dung: tenNoiDung,
          mo_ta: moTa,
          thu_tu: thuTu
        });
        setNotification({ message: "Thêm nội dung mới thành công!", type: 'success' });
      }
      
      resetForm();
      fetchData(); // Tải lại danh sách
    } catch (error: any) {
      setNotification({ message: error.message || "Có lỗi xảy ra", type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    // Với thao tác Xóa quan trọng, vẫn nên giữ confirm của trình duyệt hoặc dùng Modal riêng
    if(!window.confirm("Bạn có chắc chắn muốn xóa nội dung này không?")) return;
    
    try {
      await deleteCourseModule(id);
      setNotification({ message: "Đã xóa nội dung thành công!", type: 'success' });
      fetchData();
    } catch (error: any) {
      setNotification({ message: error.message, type: 'error' });
    }
  };

  const handleEditClick = (item: NoiDungKhoaHoc) => {
    setEditingId(item.id);
    setTenNoiDung(item.ten_noi_dung);
    setMoTa(item.mo_ta || '');
    setThuTu(item.thu_tu);
    setNotification(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ marginTop: '20px', position: 'relative' }}>
      
      {/* 4. Hiển thị Component Notification ở đây */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* --- FORM NHẬP LIỆU --- */}
      <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h4 style={{ marginTop: 0, color: '#2c3e50' }}>
          {editingId ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
        </h4>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9em'}}>Thứ tự</label>
              <input 
                type="number" 
                className="form-input"
                min="1"
                value={thuTu}
                onChange={(e) => setThuTu(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9em'}}>Tên chương / Bài học <span style={{color:'red'}}>*</span></label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Ví dụ: Chương 1 - Giới thiệu"
                value={tenNoiDung}
                onChange={(e) => setTenNoiDung(e.target.value)}
                // Bỏ required mặc định để tự xử lý validation hiển thị popup
              />
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9em'}}>Mô tả ngắn (Tùy chọn)</label>
            <textarea 
              className="form-input"
              rows={2}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="form-button"
              style={{ backgroundColor: editingId ? '#f39c12' : '#27ae60' }}
            >
              {editingId ? 'Lưu thay đổi' : 'Thêm nội dung'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                className="form-button form-button-secondary"
                onClick={resetForm}
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- DANH SÁCH HIỂN THỊ --- */}
      {loading ? <p>Đang tải...</p> : (
        <table className="styled-table" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
          <thead>
            <tr>
              <th style={{ width: '20px', textAlign: 'center', }}>STT</th>
              <th style={{ maxWidth: '200px' }}>Tên Nội Dung</th>
              <th style={{ maxWidth: '200px' }}>Mô Tả</th>
              <th style={{ width: '130px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(mod => (
              <tr key={mod.id} style={{ backgroundColor: editingId === mod.id ? '#fff3cd' : 'inherit' }}>
                <td style={{ textAlign: 'center', fontWeight: 'bold', width: '20px' }}>
                  {mod.thu_tu}
                </td>
                <td style={{ maxWidth: '200px' }}>
                  <strong>{mod.ten_noi_dung}</strong>
                </td>
                <td style={{ maxWidth: '200px' }}>{mod.mo_ta}</td>
                <td style={{ width: '130px' }}>
                  <button 
                    onClick={() => handleEditClick(mod)}
                    className='form-button'
                    style={{padding: '5px 10px'}}
                    title="Sửa"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(mod.id)}
                    className='form-button form-button-secondary'
                    style={{padding: '5px 10px'}}
                    title="Xóa"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#999999', padding: '20px' }}>
                  Chưa có nội dung nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseContentManager;