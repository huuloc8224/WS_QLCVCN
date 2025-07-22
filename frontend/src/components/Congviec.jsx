import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import jobApi from '../api/jobApi';
import typejobApi from '../api/typejobApi';

const initialTaskState = {
  name: '',
  category: '',
  startDate: '',
  endDate: '',
  status: 'Chưa thực hiện',
  description: '',
};

const mapStatus = {
  'Chưa thực hiện': 'todo',
  'Đang thực hiện': 'in_progress',
  'Đã hoàn thành': 'done',
};

const mapStatusReverse = {
  'todo': 'Chưa thực hiện',
  'in_progress': 'Đang thực hiện',
  'done': 'Đã hoàn thành',
};

const CongViec = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentTask, setCurrentTask] = useState(initialTaskState);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ category: '', status: '', date: '' });

  const formRef = useRef(null);
  const tenCongViecRef = useRef(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, categoryRes] = await Promise.all([
          jobApi.getAll(),
          typejobApi.getAll(),
        ]);
        setTasks(jobRes.data);
        setCategories(categoryRes.data.data.map(c => c.name));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };
    fetchData();
  }, []);

  // Áp dụng filter từ URL
  useEffect(() => {
    if (selectedCategory) {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  // Cập nhật form khi chỉnh sửa
  useEffect(() => {
    if (editingTask) {
      setCurrentTask(editingTask);
    } else {
      setCurrentTask(initialTaskState);
    }
  }, [editingTask]);

  const getTypejobId = async (name) => {
    const res = await typejobApi.getAll();
    const match = res.data.data.find(item => item.name === name);
    return match ? match._id : null;
  };

  const handleSaveTask = async () => {
    if (!currentTask.name || !currentTask.category || !currentTask.startDate || !currentTask.endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (new Date(currentTask.endDate) < new Date(currentTask.startDate)) {
      alert('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!');
      return;
    }

    try {
      const formData = {
        title: currentTask.name,
        description: currentTask.description,
        start_date: currentTask.startDate,
        due_date: currentTask.endDate,
        status: mapStatus[currentTask.status] || 'todo',
        typejob: await getTypejobId(currentTask.category),
      };

      if (editingTask) {
        await jobApi.update(editingTask._id, formData);
        alert('Cập nhật công việc thành công!');
      } else {
        await jobApi.create(formData);
        alert('Thêm công việc thành công!');
      }

      const jobRes = await jobApi.getAll();
      setTasks(jobRes.data);
      setEditingTask(null);
      setCurrentTask(initialTaskState);
    } catch (err) {
      console.error('Lỗi khi lưu công việc:', err);
      alert('Đã có lỗi xảy ra.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá công việc này?')) {
      try {
        await jobApi.delete(id);
        setTasks(tasks.filter(t => t._id !== id));
      } catch (err) {
        console.error(err);
        alert('Xoá thất bại');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchCategory = filters.category ? task.typejob?.name === filters.category : true;
    const matchStatus = filters.status ? task.status === mapStatus[filters.status] : true;
    const matchDate = filters.date ? new Date(task.due_date) >= new Date(filters.date) : true;
    return matchCategory && matchStatus && matchDate;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 tracking-wide">QUẢN LÝ CÔNG VIỆC</h1>

      {/* Form tạo/sửa */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xl mb-10" ref={formRef}>
        <h2 className="text-xl font-semibold text-blue-600 mb-6 text-center tracking-tight uppercase">
          {editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tên công việc */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Tên công việc</label>
            <input
              ref={tenCongViecRef}
              type="text"
              value={currentTask.name}
              onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="Nhập tên công việc"
            />
          </div>

          {/* Loại công việc */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Loại công việc</label>
            <input
              type="text"
              list="category-options"
              value={currentTask.category}
              onChange={(e) => setCurrentTask({ ...currentTask, category: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="Nhập hoặc chọn loại công việc"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const newCat = currentTask.category.trim();
                  if (newCat && !categories.includes(newCat)) {
                    setCategories([...categories, newCat]);
                  }
                }
              }}
            />
            <datalist id="category-options">
              {categories.map((cat, i) => <option key={i} value={cat} />)}
            </datalist>
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={currentTask.startDate}
              onChange={(e) => setCurrentTask({ ...currentTask, startDate: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Ngày kết thúc */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Ngày kết thúc</label>
            <input
              type="date"
              value={currentTask.endDate}
              onChange={(e) => setCurrentTask({ ...currentTask, endDate: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Trạng thái</label>
            <select
              value={currentTask.status}
              onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option>Chưa thực hiện</option>
              <option>Đang thực hiện</option>
              <option>Đã hoàn thành</option>
            </select>
          </div>

          {/* Mô tả */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Mô tả</label>
            <textarea
              value={currentTask.description}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              className="w-full border-gray-300 border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400"
              placeholder="Nhập mô tả chi tiết"
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={handleSaveTask}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition shadow"
          >
            <PlusIcon className="w-5 h-5 inline-block mr-2" />
            {editingTask ? 'Lưu công việc' : 'Thêm công việc'}
          </button>

          {editingTask && (
            <button
              onClick={() => {
                setEditingTask(null);
                setCurrentTask(initialTaskState);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Huỷ
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border p-2 rounded-lg shadow-sm focus:outline-none"
        >
          <option value="">-- Lọc theo loại --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded-lg shadow-sm focus:outline-none"
        >
          <option value="">-- Lọc theo trạng thái --</option>
          <option>Chưa thực hiện</option>
          <option>Đang thực hiện</option>
          <option>Đã hoàn thành</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      {/* Danh sách công việc */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-400 col-span-2 py-10 text-lg italic">
            Không có công việc nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="border rounded-2xl p-5 shadow-lg hover:shadow-2xl transition bg-white">
              <h2 className="text-lg font-bold text-blue-700">{task.title}</h2>
              <p className="text-sm text-gray-500 mt-1">📁 Loại: {task.typejob?.name}</p>
              <p className="text-sm text-gray-500">📅 Từ: {task.start_date?.slice(0, 10)} → {task.due_date?.slice(0, 10)}</p>
              <p className="text-sm mt-1">
                🟢 Trạng thái:
                <span className={`ml-1 font-semibold ${
                  task.status === 'done' ? 'text-green-600' :
                  task.status === 'in_progress' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {mapStatusReverse[task.status]}
                </span>
              </p>
              <p className="mt-3 text-gray-700 text-sm">{task.description}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setEditingTask({
                      _id: task._id,
                      name: task.title,
                      category: task.typejob?.name,
                      startDate: task.start_date?.slice(0, 10),
                      endDate: task.due_date?.slice(0, 10),
                      status: mapStatusReverse[task.status],
                      description: task.description,
                    });
                    setTimeout(() => {
                      tenCongViecRef.current?.focus();
                      formRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow"
                >
                  <PencilIcon className="w-4 h-4 inline-block" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                >
                  <TrashIcon className="w-4 h-4 inline-block" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="h-20" />
    </div>

  );
};

export default CongViec;
