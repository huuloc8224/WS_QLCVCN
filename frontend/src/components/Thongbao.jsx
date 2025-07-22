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
    <div className="h-full p-6 bg-yellow-50 border border-yellow-300 rounded-3xl shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-yellow-500" />
        Thông báo công việc
      </h2>

      <div
        ref={contentRef}
        className="overflow-y-auto max-h-[300px] pr-2 space-y-2"
      >
        {notifications.map(task => (
          <div
            key={`${task.id}-${task.deadline}`}
            className={`p-3 rounded-xl text-sm flex gap-2 ${
              task.status === 'done'
                ? 'bg-green-100 text-green-700'
                : task.diffDays < 0
                ? 'bg-red-100 text-red-700 font-medium'
                : task.diffDays === 0
                ? 'bg-yellow-100 text-yellow-900'
                : 'bg-white text-gray-700 border'
            }`}
          >
            <BellIcon className="w-4 h-4 mt-0.5 text-yellow-500" />
            <div>
              <strong>"{task.title}"</strong> — {task.message}.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thongbao;
