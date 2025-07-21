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
      alert('Thêm thành công!');
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
      <div className="text-xl ml-2 mt-2 font-bold text-blue-700">
        LOẠI CÔNG VIỆC
      </div>
      <hr className="border-t-2 border-gray-300/30 my-4 mx-4" />

      {/* Form thêm mới */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Nhập tên công việc mới"
          className="border p-2 rounded mr-2 w-[300px]"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAddTask}
          className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Thêm
        </button>
      </div>

      {/* Danh sách loại công việc */}
      <div className="flex flex-wrap gap-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="relative flex items-center justify-center rounded-full bg-gray-100 text-gray-800 font-bold px-4 py-2 hover:shadow-lg hover:bg-gray-200 group"
          >
            {editingTask?._id === task._id ? (
              <input
                type="text"
                className="border rounded-full px-3 py-1 focus:outline-none"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            ) : (
              <span
                onClick={() => navigate(`/congviec?category=${encodeURIComponent(task.name)}`)}
                className="cursor-pointer hover:underline"
              >
                {task.name}
              </span>
            )}
            <div className="absolute right-2 top-1 flex space-x-1 opacity-0 group-hover:opacity-100">
              {editingTask?._id === task._id ? (
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white p-1 rounded-full"
                  title="Lưu"
                >
                  ✅
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-yellow-400 text-white p-1 rounded-full"
                    title="Sửa"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white p-1 rounded-full"
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
