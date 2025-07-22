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
    <div className="p-6 bg-white rounded-3xl shadow-xl w-full h-full">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Trạng thái công việc
      </h2>

      <div ref={chartRef} className="relative flex justify-center items-center mb-6">
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            isAnimationActive={isVisible}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        <div className="absolute text-center">
          {activeIndex !== null ? (
            <>
              <div className="text-2xl font-bold text-gray-800">
                {getPercentage(chartData[activeIndex].value)}
              </div>
              <div className="text-sm text-gray-500">
                {chartData[activeIndex].name}
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-500">Tổng</div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {[
          { icon: MinusCircleIcon, text: 'Chưa thực hiện', value: toDo, color: 'text-orange-600' },
          { icon: ArrowPathIcon, text: 'Đang thực hiện', value: inProgress, color: 'text-blue-600' },
          { icon: CheckCircleIcon, text: 'Đã hoàn thành', value: done, color: 'text-pink-600' },
        ].map(({ icon: Icon, text, value, color }, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 cursor-pointer max-w-fit hover:opacity-80 ${color}`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Icon className="w-5 h-5" />
            <span>
              {text}: {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trangthai;
