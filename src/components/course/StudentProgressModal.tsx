import React, { useState, useEffect } from 'react';
// Import Service
import { 
  getStudentProgress, 
  updateStudentProgress, 
  NoiDungKhoaHoc 
} from '../../services/khoahoc.service';

// Import Component Thông báo
import Notification from '../notification/Notification';
import "../../styles/StudentProgressModal.css"

interface Props {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  studentName: string;
  studentId: string;
  onClose: () => void;
  onUpdateSuccess?: () => void; // <--- 1. THÊM DÒNG NÀY
}

const StudentProgressModal: React.FC<Props> = ({ 
  maKhoaHoc,
  tenKhoaHoc, 
  studentName, 
  studentId, 
  onClose ,
  onUpdateSuccess 
}) => {
  const [modules, setModules] = useState<NoiDungKhoaHoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // State cho thông báo popup
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // 1. Load dữ liệu khi mở Modal
  useEffect(() => {
    if (maKhoaHoc && studentId) {
      fetchProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maKhoaHoc, studentId]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const data = await getStudentProgress(maKhoaHoc, studentId);
      setModules(data);
    } catch (error) {
      console.error("Lỗi tải tiến độ:", error);
      setNotification({ message: "Không thể tải dữ liệu tiến độ.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý khi tick checkbox (Chỉ cập nhật State tạm thời, chưa gọi API)
  const handleCheckChange = (id_noi_dung: number) => {
    setModules(prevList => 
      prevList.map(item => {
        if (item.id === id_noi_dung) {
          // Đảo ngược trạng thái
          const newStatus = item.trang_thai === 'HOÀN THÀNH' ? 'CHƯA HOÀN THÀNH' : 'HOÀN THÀNH';
          return { ...item, trang_thai: newStatus };
        }
        return item;
      })
    );
  };

  // 3. Xử lý khi bấm nút "Cập nhật" (Lưu tất cả xuống Server)
  // 3. SỬA HÀM handleSave
  const handleSave = async () => {
    setSaving(true);
    setNotification(null);

    try {
      const requests = modules.map(mod => 
        updateStudentProgress({
          ma_hoc_vien: studentId,
          id_noi_dung: mod.id,
          trang_thai: mod.trang_thai || 'CHƯA HOÀN THÀNH'
        })
      );

      await Promise.all(requests);

      // Báo cho trang cha biết để reload lại thanh tiến độ
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      // Hiện thông báo thành công
      setNotification({ message: 'Cập nhật tiến độ thành công!', type: 'success' });
      
      // (Tuỳ chọn) Tự động đóng sau 1.5s nếu muốn
      // setTimeout(onClose, 1500);

    } catch (error) {
      console.error("Lỗi lưu tiến độ:", error);
      setNotification({ message: 'Có lỗi xảy ra khi lưu dữ liệu.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-progress-overlay">
      <div className="student-progress-modal">

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="student-progress-header">
          <h3>Tiến độ học tập</h3>
          <button onClick={onClose} className="student-progress-close-btn">
            &times;
          </button>
        </div>

        

        <div className="student-progress-body">
          <p className='student-progress-text'>
            Học viên: <strong>{studentName}</strong> <br/>
            Mã số: {studentId} <br/>
            Khóa học: <strong>{tenKhoaHoc}</strong> ({maKhoaHoc})
          </p>

          <hr style={{ borderTop: '1px solid #eee', marginBottom: '15px' }} />

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : modules.length === 0 ? (
            <p style={{ color: '#CC0033' }}>
              Khóa học này chưa có nội dung bài học nào được tạo.
            </p>
          ) : (
            <div className="student-progress-list">
              <table className="styled-table" style={{ width: '100%', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Xong</th>
                    <th style={{ maxWidth: '500px' }}>Tên Bài / Chương</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(mod => (
                    <tr
                      key={mod.id}
                      onClick={() => handleCheckChange(mod.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <input
                          type="checkbox"
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          checked={mod.trang_thai === 'HOÀN THÀNH'}
                          readOnly
                        />
                      </td>
                      <td style={{ maxWidth: '500px' }}>
                        <div style={{ fontWeight: '500' }}>{mod.ten_noi_dung}</div>
                        {mod.mo_ta && (
                          <small style={{ color: '#666' }}>{mod.mo_ta}</small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="student-progress-footer">
          <button
            className="form-button"
            style={{ backgroundColor: '#28a745', minWidth: '100px' }}
            onClick={handleSave}
            disabled={saving || loading || modules.length === 0}
          >
            {saving ? 'Đang lưu...' : 'Cập nhật'}
          </button>

          <button
            className="form-button form-button-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

};


export default StudentProgressModal;