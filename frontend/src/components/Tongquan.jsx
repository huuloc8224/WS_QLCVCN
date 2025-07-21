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
    <div className="flex flex-col h-auto">
      {/* Phần thống kê trên */}
      <div className="p-6">
        <div className="text-xl ml-2 mt-2 font-bold text-blue-700">
          TỔNG QUAN
        </div>
        <hr className="border-t-2 border-gray-300/30 my-4 mx-4" />

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center">
          {/* Card 1: loại công việc */}
          <nav className="w-26 sm:w-44 h-14 bg-green-700 flex justify-center items-center rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="text-sm sm:text-base text-white">Loại công việc</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                <CountUp end={totalTypes} duration={2} />
              </p>
            </div>
          </nav>

          {/* Card 2: tổng công việc */}
          <nav className="w-26 sm:w-44 h-14 bg-red-700 flex justify-center items-center rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="text-sm sm:text-base text-white">Số lượng công việc</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                <CountUp end={totalJobs} duration={2} />
              </p>
            </div>
          </nav>

          {/* Card 3: chưa thực hiện */}
          <nav className="w-26 sm:w-32 h-14 bg-amber-500 flex justify-center items-center rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-white">Chưa thực hiện</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                <CountUp end={todoCount} duration={2} />
              </p>
            </div>
          </nav>

          {/* Card 4: đang thực hiện */}
          <nav className="w-26 sm:w-32 h-14 bg-blue-700 flex justify-center items-center rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-white">Đang thực hiện</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                <CountUp end={inProgressCount} duration={2} />
              </p>
            </div>
          </nav>

          {/* Card 5: đã hoàn thành */}
          <nav className="w-26 sm:w-32 h-14 bg-pink-700 flex justify-center items-center rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-white">Đã hoàn thành</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                <CountUp end={doneCount} duration={2} />
              </p>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tongquan;
