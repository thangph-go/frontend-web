import React, { useEffect, useState } from 'react';
import '../styles/forms.css';
import '../styles/tables.css';
import { getStatsByCourse, StatsKhoaHoc } from '../services/thongke.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ThongKeKhoaHocPage = () => {
  const [data, setData] = useState<StatsKhoaHoc[] | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiData = await getStatsByCourse(year);
        setData(apiData);
      } catch (err: any) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  return (
    <div className="page-container">
      <h2>Thống kê Khóa học theo Năm</h2>
      <hr style={{ background: "#888", height: "2px", margin: "20px 0" }} />

      <div className="form-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
        <label>Chọn năm thống kê:</label>
        <input 
          type="number" 
          className="form-input" 
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div style={{ width: '100%', height: 500, marginBottom: '40px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>
              Biểu đồ Kết quả Khóa học năm {year}
            </h4>
            
            {data && data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  barSize={50}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ten_khoa" 
                    angle={-45} 
                    textAnchor="end"
                    interval={0}
                    height={100}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />

                  <Bar dataKey="so_luong_dat" name="Đạt" stackId="a" fill="#2ecc71" />
                  <Bar dataKey="so_luong_khong_dat" name="Không Đạt" stackId="a" fill="#e74c3c" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center' }}>Không có dữ liệu khóa học cho năm {year}.</p>
            )}
          </div>

          <hr style={{ background: "#888", height: "2px", margin: "20px 0" }} />
          <h3>Dữ liệu chi tiết</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Mã Khóa</th>
                <th>Tên Khóa Học</th>
                <th>Tổng số HV</th>
                <th>Đạt</th>
                <th>Không Đạt</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((kh) => (
                  <tr key={kh.ma_khoa_hoc}>
                    <td>{kh.ma_khoa_hoc}</td>
                    <td>{kh.ten_khoa}</td>
                    <td style={{ fontWeight: 'bold' }}>{kh.so_luong_hoc_vien}</td>
                    <td style={{ color: '#27ae60', fontWeight: 'bold' }}>{kh.so_luong_dat}</td>
                    <td style={{ color: '#c0392b', fontWeight: 'bold' }}>{kh.so_luong_khong_dat}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}>Không tìm thấy khóa học nào.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ThongKeKhoaHocPage;