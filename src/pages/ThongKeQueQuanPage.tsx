import React, { useEffect, useState } from 'react';
import '../styles/tables.css'; 
import { getStatsByHometown, StatsQueQuan } from '../services/thongke.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const ThongKeQueQuanPage = () => {
  const [data, setData] = useState<StatsQueQuan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await getStatsByHometown();
        setData(apiData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-container">
      <h2>Thống kê Học viên theo Quê quán</h2>
      <hr style={{ background: "#888", height: "2px", margin: "20px 0" }} />

      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div style={{ width: '100%', height: 500, marginBottom: '40px' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Biểu đồ phân bố theo Quê quán</h4>
            {data && data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ten_tinh" 
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                  <Bar dataKey="so_luong" name="Số lượng học viên" fill="#3498db" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center' }}>Không đủ dữ liệu để vẽ biểu đồ.</p>
            )}
          </div>

          <hr style={{ background: "#888", height: "2px", margin: "20px 0" }} />
          <h3>Dữ liệu chi tiết</h3>
          <table className="styled-table">
            <thead>
              <tr><th>Tên Tỉnh</th><th>Mã Tỉnh</th><th>Số Lượng</th></tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.ma_tinh_que_quan}>
                    <td>{item.ten_tinh}</td>
                    <td>{item.ma_tinh_que_quan}</td>
                    <td>{item.so_luong}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3}>Không có dữ liệu.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ThongKeQueQuanPage;