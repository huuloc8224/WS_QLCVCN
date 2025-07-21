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
      <h1 className="text-xl font-bold text-blue-700 mb-4">CÔNG VIỆC</h1>

      {/* Form tạo/sửa */}
      <div className="bg-white border rounded-xl p-6 shadow-lg mb-8" ref={formRef}>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
          {editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tên công việc</label>
            <input
              ref={tenCongViecRef}
              type="text"
              value={currentTask.name}
              onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Nhập tên công việc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Loại công việc</label>
            <input
              type="text"
              list="category-options"
              value={currentTask.category}
              onChange={(e) => setCurrentTask({ ...currentTask, category: e.target.value })}
              className="w-full border p-2 rounded"
              placeholder="Chọn hoặc nhập loại công việc"
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

          <div>
            <label className="block text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="date"
              value={currentTask.startDate}
              onChange={(e) => setCurrentTask({ ...currentTask, startDate: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Ngày kết thúc</label>
            <input
              type="date"
              value={currentTask.endDate}
              onChange={(e) => setCurrentTask({ ...currentTask, endDate: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Trạng thái</label>
            <select
              value={currentTask.status}
              onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option>Chưa thực hiện</option>
              <option>Đang thực hiện</option>
              <option>Đã hoàn thành</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Mô tả</label>
            <textarea
              value={currentTask.description}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              className="w-full border p-2 rounded h-[80px]"
              placeholder="Nhập mô tả"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={handleSaveTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {editingTask ? 'Lưu công việc' : 'Thêm công việc'}
          </button>

          {editingTask && (
            <button
              onClick={() => {
                setEditingTask(null);
                setCurrentTask(initialTaskState);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="">-- Lọc theo loại --</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />
      </div>

      {/* Danh sách công việc */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500 col-span-2 py-8">
            Không có công việc nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task._id} className="border p-4 rounded shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold text-blue-600">{task.title}</h2>
              <p className="text-gray-600">Loại: {task.typejob?.name}</p>
              <p className="text-gray-600">Từ: {task.start_date?.slice(0, 10)} - đến: {task.due_date?.slice(0, 10)}</p>
              <p className="text-gray-600">
                Trạng thái:
                <span className={`ml-1 font-semibold ${
                  task.status === 'done' ? 'text-green-600' :
                  task.status === 'in_progress' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {mapStatusReverse[task.status]}
                </span>
              </p>
              <p className="mt-2 text-gray-700">{task.description}</p>
              <div className="flex gap-2 mt-3">
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
                  className="bg-yellow-400 text-white p-1 rounded"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
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
