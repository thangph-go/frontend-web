// File: src/components/common/Notification.tsx
import React, { useEffect } from 'react';
import '../../styles/notification.css'; // Import file CSS

// 1. Định nghĩa Props (dữ liệu đầu vào)
interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void; // Hàm callback để báo cho component cha là "Tôi đã đóng"
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  
  // 2. Tự động đóng sau 5 giây
  useEffect(() => {
    // Tạo một bộ đếm thời gian
    const timer = setTimeout(() => {
      onClose(); // Gọi hàm onClose
    }, 5000); // 5000 mili-giây = 5 giây

    // Dọn dẹp: Hủy bộ đếm nếu component bị gỡ (unmount)
    return () => clearTimeout(timer);
  }, [onClose]);

  // 3. Giao diện (JSX)
  return (
    // Áp dụng class CSS "thông minh"
    <div className={`notification notification-${type}`}>
      {message}
    </div>
  );
};

export default Notification;