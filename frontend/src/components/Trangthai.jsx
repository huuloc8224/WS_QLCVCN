import React, { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell } from "recharts";
import jobApi from "../api/jobApi";
import {
  DocumentIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  CircleStackIcon,
  RadioIcon,
  MinusCircleIcon, // ← THÊM DÒNG NÀY VÀO
} from "@heroicons/react/24/solid";

const COLORS = ["#FF9800", "#2196F3", "#E91E63"];

const Trangthai = () => {
  const [workItems, setWorkItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await jobApi.getAll();
        setWorkItems(res.data); // Dữ liệu từ backend
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu công việc:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const chartElement = chartRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (chartElement) observer.observe(chartElement);
    return () => {
      if (chartElement) observer.unobserve(chartElement);
    };
  }, []);

  // Tổng số công việc và phân loại theo status
  const total = workItems.length;
  const toDo = workItems.filter((item) => item.status === "todo").length;
  const inProgress = workItems.filter((item) => item.status === "in_progress").length;
  const done = workItems.filter((item) => item.status === "done").length;

  const chartData = [
    { name: "Chưa thực hiện", value: toDo },
    { name: "Đang thực hiện", value: inProgress },
    { name: "Đã hoàn thành", value: done },
  ];

  const getPercentage = (value) => {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(0)}%`;
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg w-full max-w-md bg-white h-full">
      <h2 className="text-2xl font-bold mb-4 flex justify-center">Trạng thái công việc</h2>

      <div
        ref={chartRef}
        className="relative flex items-center justify-center mb-6"
      >
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            isAnimationActive={isVisible}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {activeIndex !== null ? (
            <div className="text-2xl font-bold text-gray-800 text-center">
              {getPercentage(chartData[activeIndex].value)}
              <div className="text-sm text-gray-600">
                {chartData[activeIndex].name}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-800 text-center">
              {total}
              <div className="text-sm text-gray-600">Tổng</div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2.5 text-sm">
        <div
          className="flex items-center gap-2 cursor-pointer max-w-fit"
          onMouseEnter={() => setActiveIndex(0)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <MinusCircleIcon className="w-5 h-5 text-orange-600" />
          <span className="text-orange-600">Chưa thực hiện: {toDo}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer max-w-fit"
          onMouseEnter={() => setActiveIndex(1)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <ArrowPathIcon className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600">Đang thực hiện: {inProgress}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer max-w-fit"
          onMouseEnter={() => setActiveIndex(2)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CheckCircleIcon className="w-5 h-5 text-pink-600" />
          <span className="text-pink-600">Đã hoàn thành: {done}</span>
        </div>
      </div>
    </div>
  );
};

export default Trangthai;
