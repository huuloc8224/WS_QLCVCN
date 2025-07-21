const Job = require('../models/job');
const Typejob = require('../models/typejob');
const Log = require('../models/log');

// Bản đồ trạng thái tiếng Việt
const statusMap = {
  todo: 'Chưa thực hiện',
  in_progress: 'Đang thực hiện',
  done: 'Đã hoàn thành',
};

// Hàm ghi log
const logAction = async (userId, job, action, details = '') => {
  try {
    await Log.create({
      action,
      jobId: job._id,
      jobTitle: job.title,
      userId,
      details,
    });
  } catch (err) {
    console.error('❌ Lỗi khi ghi lịch sử:', err);
  }
};

// Lấy tất cả công việc theo user
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user.id }).populate('typejob');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách công việc:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lọc công việc theo typejob
exports.getJobByTypejob = async (req, res) => {
  try {
    const { typejob } = req.query;
    const query = { owner: req.user.id };
    if (typejob) query.typejob = parseInt(typejob, 10);

    const jobs = await Job.find(query).populate('typejob');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Lỗi khi lọc theo typejob:', error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy công việc theo tên loại công việc
exports.getJobByTypejobName = async (req, res) => {
  try {
    const typejob = await Typejob.findOne({ name: req.params.typejobName });
    if (!typejob) {
      return res.status(404).json({ message: 'Không tìm thấy loại công việc' });
    }

    const jobs = await Job.find({
      typejob: typejob._id,
      owner: req.user.id
    }).populate('typejob');

    res.json(jobs);
  } catch (error) {
    console.error('❌ Lỗi khi lấy công việc theo tên loại:', error);
    res.status(500).json({ message: 'Lỗi khi lấy công việc theo loại', error });
  }
};

// Tạo công việc mới
exports.createJob = async (req, res) => {
  const { title, description, status, typejob, start_date, due_date } = req.body;

  try {
    const job = new Job({
      title,
      description,
      status,
      typejob: parseInt(typejob, 10),
      start_date,
      due_date,
      owner: req.user.id
    });

    await job.save();
    await logAction(req.user.id, job, 'Tạo', 'Đã tạo công việc mới');

    res.status(201).json({ message: 'Tạo công việc thành công', job });
  } catch (error) {
    console.error('❌ Lỗi khi tạo công việc:', error);
    res.status(500).json({ message: 'Lỗi khi tạo công việc', error });
  }
};

// Cập nhật công việc
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, typejob, start_date, due_date } = req.body;

  try {
    const oldJob = await Job.findOne({ _id: id, owner: req.user.id });
    if (!oldJob) {
      return res.status(404).json({ message: 'Không tìm thấy công việc để cập nhật' });
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      {
        title,
        description,
        status,
        typejob: parseInt(typejob, 10),
        start_date,
        due_date
      },
      { new: true }
    );

    let changes = [];
    if (oldJob.title !== title) changes.push(`Tiêu đề: "${oldJob.title}" → "${title}"`);
    
    if (oldJob.status !== status) {
      const oldStatusText = statusMap[oldJob.status] || oldJob.status;
      const newStatusText = statusMap[status] || status;
      changes.push(`Trạng thái: "${oldStatusText}" → "${newStatusText}"`);
    }

    if (
      oldJob.due_date?.toISOString().slice(0, 10) !==
      new Date(due_date).toISOString().slice(0, 10)
    ) {
      changes.push(`Hạn: ${oldJob.due_date?.toISOString().slice(0, 10)} → ${due_date}`);
    }

    await logAction(
      req.user.id,
      updatedJob,
      'Cập nhật',
      changes.length ? changes.join(', ') : 'Cập nhật công việc'
    );

    res.status(200).json({ message: 'Cập nhật thành công', job: updatedJob });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật công việc:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật công việc', error });
  }
};

// Xoá công việc
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: id,
      owner: req.user.id
    });

    if (!deletedJob) {
      return res.status(404).json({ message: 'Không tìm thấy công việc để xoá' });
    }

    await logAction(req.user.id, deletedJob, 'Xoá', 'Đã xoá công việc');

    res.status(200).json({ message: 'Xoá công việc thành công' });
  } catch (error) {
    console.error('❌ Lỗi khi xoá công việc:', error);
    res.status(500).json({ message: 'Lỗi khi xoá công việc', error });
  }
};
