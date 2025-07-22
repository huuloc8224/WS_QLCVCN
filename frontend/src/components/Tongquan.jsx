import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import jobApi from '../api/jobApi';
import typejobApi from '../api/typejobApi';

const Tongquan = () => {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalTypes, setTotalTypes] = useState(0);
  const [todoCount, setTodoCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, typeRes] = await Promise.all([
          jobApi.getAll(),
          typejobApi.getAll()
        ]);

        const jobs = jobRes.data;
        setTotalJobs(jobs.length);
        setTotalTypes(typeRes.data.data.length);

        // Đếm số lượng theo trạng thái
        const countByStatus = {
          todo: 0,
          in_progress: 0,
          done: 0
        };

        jobs.forEach(job => {
          if (countByStatus[job.status] !== undefined) {
            countByStatus[job.status]++;
          }
        });

        setTodoCount(countByStatus.todo);
        setInProgressCount(countByStatus.in_progress);
        setDoneCount(countByStatus.done);

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tổng quan:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-auto p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">TỔNG QUAN</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Loại công việc', count: totalTypes, bg: 'bg-green-600' },
          { label: 'Số lượng công việc', count: totalJobs, bg: 'bg-red-600' },
          { label: 'Chưa thực hiện', count: todoCount, bg: 'bg-amber-500' },
          { label: 'Đang thực hiện', count: inProgressCount, bg: 'bg-blue-500' },
          { label: 'Đã hoàn thành', count: doneCount, bg: 'bg-pink-600' },
        ].map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md p-4 text-white flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 ${item.bg}`}
          >
            <p className="text-sm md:text-base">{item.label}</p>
            <p className="text-xl md:text-2xl font-bold">
              <CountUp end={item.count} duration={2} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tongquan;
