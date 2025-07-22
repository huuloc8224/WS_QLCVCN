import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import typejobApi from '../api/typejobApi';

const Loaicongviec = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedName, setEditedName] = useState('');

  // Hàm lấy lại danh sách loại công việc
  const fetchTasks = async () => {
    try {
      const res = await typejobApi.getAll();
      setTasks(res.data.data);
    } catch (err) {
      console.error('Lỗi khi lấy loại công việc:', err);
    }
  };

  // Gọi fetchTasks khi component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Thêm loại công việc mới
  const handleAddTask = async () => {
    if (newTaskName.trim() === '') return;

    try {
      await typejobApi.create({ name: newTaskName });
      setNewTaskName('');
      fetchTasks(); // Load lại danh sách sau khi thêm
    } catch (err) {
      console.error(err);
      alert('Thêm thất bại!');
    }
  };

  // Xoá loại công việc
  const handleDeleteTask = async (_id) => {
    if (!window.confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await typejobApi.delete(_id);
      fetchTasks(); // Load lại danh sách sau khi xoá
    } catch (err) {
      console.error(err);
      alert('Xoá thất bại!');
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditedName(task.name);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const res = await typejobApi.update(editingTask._id, { name: editedName });
      setTasks(tasks.map(task =>
        task._id === editingTask._id ? res.data : task
      ));
      setEditingTask(null);
      setEditedName('');
    } catch (err) {
      console.error(err);
      alert('Cập nhật thất bại!');
    }
  };
  // Hàm xử lý phím Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn form submit nếu có
      handleAddTask();
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="text-2xl font-bold text-blue-800 mb-2">
        LOẠI CÔNG VIỆC
      </div>
      <hr className="border-t-2 border-blue-200 mb-6" />

      {/* Form thêm mới */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Nhập tên loại công việc mới"
          className="border border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-lg px-4 py-2 w-[280px] outline-none shadow-sm"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm
        </button>
      </div>

      {/* Danh sách loại công việc */}
      <div className="flex flex-wrap gap-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="relative flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-full shadow-sm transition-all group"
          >
            {editingTask?._id === task._id ? (
              <input
                type="text"
                className="border border-gray-300 rounded-full px-3 py-1 focus:outline-none text-sm"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            ) : (
              <span
                onClick={() =>
                  navigate(`/congviec?category=${encodeURIComponent(task.name)}`)
                }
                className="cursor-pointer hover:underline text-sm"
              >
                {task.name}
              </span>
            )}

            {/* Action buttons */}
            <div className="absolute -right-1.5 -top-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
              {editingTask?._id === task._id ? (
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white p-1 rounded-full shadow"
                  title="Lưu"
                >
                  ✅
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-full shadow"
                    title="Sửa"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow"
                    title="Xóa"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Loaicongviec;
