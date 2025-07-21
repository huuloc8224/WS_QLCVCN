// src/pages/Lichsu.jsx
import React, { useEffect, useState } from 'react';
import logApi from '../api/logApi';


const Lichsu = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await logApi.getAll();
        setLogs(res.data);
      } catch (err) {
        console.error('Lỗi lấy lịch sử:', err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <div className="text-2xl ml-2 mb-3 font-bold text-blue-700">
        Lịch sử thay đổi
      </div>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-500">Không có lịch sử thay đổi nào.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="bg-white shadow rounded p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700">
                <strong>{log.action}</strong> công việc <strong>{log.jobTitle || 'Không rõ'}</strong>
              </p>
              <p className="text-xs text-gray-500">
                Vào lúc: {new Date(log.createdAt).toLocaleString()}
              </p>
              {log.details && (
                <p className="text-sm text-gray-600">Chi tiết: {log.details}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Lichsu;
