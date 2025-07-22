import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import jobApi from '../api/jobApi';
import typejobApi from '../api/typejobApi';
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/solid'; // Solid để icon đậm và rõ

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

  const cards = [
    {
      label: 'Loại công việc',
      count: totalTypes,
      icon: BriefcaseIcon,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Số lượng công việc',
      count: totalJobs,
      icon: ClipboardDocumentListIcon,
      color: 'bg-red-100 text-red-700',
    },
    {
      label: 'Chưa thực hiện',
      count: todoCount,
      icon: MinusCircleIcon,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: 'Đang thực hiện',
      count: inProgressCount,
      icon: ArrowPathIcon,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Đã hoàn thành',
      count: doneCount,
      icon: CheckCircleIcon,
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-8">TỔNG QUAN</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-5 rounded-xl shadow-sm bg-white hover:shadow-md transition duration-300"
            >
              <div>
                <p className="text-gray-600 text-sm mb-1">{item.label}</p>
                <p className="text-2xl font-bold">
                  <CountUp end={item.count} duration={2} />
                </p>
              </div>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color}`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tongquan;
