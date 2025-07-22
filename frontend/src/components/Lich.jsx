import React, { useState, useEffect } from 'react';
import jobApi from '../api/jobApi';

const Lich = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [tasks, setTasks] = useState([]);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await jobApi.getAll();
        setTasks(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error.response || error.message);
      }
    };

    fetchTasks();
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Tạo ma trận ngày trong tháng
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const days = [];

  let week = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) week.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    week.push(i);
    if (week.length === 7) {
      days.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    days.push(week);
  }

  // Map màu theo trạng thái
  const mapStatusToColor = (statusCode) => {
    const map = {
      todo: '#FF9800',
      in_progress: '#2196F3',
      done: '#E91E63',
    };
    return map[statusCode] || '#9E9E9E';
  };

  // Lấy các công việc ứng với ngày
  const getTasksForDay = (day) => {
    if (!day) return [];

    const currentDate = new Date(currentYear, currentMonth, day);
    currentDate.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      const start = new Date(task.start_date || task.due_date);
      const end = new Date(task.due_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return currentDate >= start && currentDate <= end;
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          ←
        </button>

        <div className="text-2xl font-bold text-gray-800">
          {months[currentMonth]} - {currentYear}
        </div>

        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          →
        </button>
      </div>

      {/* Grid Calendar */}
      <div className="grid grid-cols-7 gap-px border border-gray-300 rounded overflow-hidden">
        {/* Header: Days of week */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold bg-gray-100 text-gray-700 uppercase text-sm tracking-wide"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((day, di) => (
              <div
                key={di}
                className="border border-gray-200 h-[100px] p-1.5 text-sm bg-white hover:bg-gray-50 transition relative flex flex-col"
              >
                {/* Ngày */}
                {day && (
                  <div className="text-xs font-semibold text-gray-600 text-right pr-1">
                    {day}
                  </div>
                )}

                {/* Tasks */}
                <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                  {getTasksForDay(day).map((task) => (
                    <div
                      key={`${task._id}-${day}`}
                      className="text-[11px] text-white px-1.5 py-0.5 rounded-md truncate shadow-sm"
                      style={{
                        backgroundColor: mapStatusToColor(task.status),
                        maxWidth: '100%',
                      }}
                      title={`${task.title} (${task.start_date?.slice(0, 10)} → ${task.due_date?.slice(0, 10)})`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

};

export default Lich;
