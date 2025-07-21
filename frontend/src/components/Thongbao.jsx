import React, { useEffect, useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/solid';
import jobApi from '../api/jobApi';

const Thongbao = () => {
  const [notifications, setNotifications] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await jobApi.getAll();
        const jobs = res.data;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const getDateDiff = (d1, d2) => {
          const diffTime = new Date(d1) - new Date(d2);
          return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        };

        const messages = jobs
          .map(task => {
            const diffDays = getDateDiff(task.due_date, todayStr);
            let message = '';

            if (task.status === 'done') {
              if (diffDays < 0) return null; // ✅ Bỏ quá hạn nếu đã hoàn thành
              message = 'Đã hoàn thành';
            } else {
              if (diffDays > 0) {
                message = `Còn ${diffDays} ngày nữa`;
              } else if (diffDays === 0) {
                message = `Hạn chót là hôm nay`;
              } else {
                message = `Đã quá hạn ${Math.abs(diffDays)} ngày`;
              }
            }

            return {
              id: task._id,
              title: task.title,
              deadline: task.due_date,
              status: task.status,
              diffDays,
              message,
            };
          })
          .filter(Boolean); // loại bỏ null

        const sorted = messages.sort((a, b) => a.diffDays - b.diffDays);
        setNotifications(sorted);
      } catch (err) {
        console.error('Lỗi khi lấy thông báo công việc:', err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="h-full p-6 bg-yellow-50/90 border border-yellow-200 rounded-xl shadow relative flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700 flex items-center gap-2">
        Thông báo công việc
      </h2>

      <div
        ref={contentRef}
        className="flex-1 pr-1 relative overflow-y-auto"
        style={{
          maxHeight: '300px',
          position: 'relative',
        }}
      >
        <div className="flex flex-col gap-2">
          {notifications.map(task => (
            <div
              key={`${task.id}-${task.deadline}`}
              className={`text-sm flex items-start gap-2 p-2 rounded ${
                task.status === 'done'
                  ? 'bg-green-50 text-green-700'
                  : task.diffDays < 0
                  ? 'bg-red-50 text-red-700 font-medium'
                  : task.diffDays === 0
                  ? 'bg-yellow-100 text-yellow-900'
                  : 'text-gray-700'
              }`}
            >
              <BellIcon className="w-4 h-4 mt-0.5 text-yellow-500 shrink-0" />
              <div>
                <span className="font-semibold">"{task.title}"</span> — {task.message}.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thongbao;
