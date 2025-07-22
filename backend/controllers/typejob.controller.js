// backend/controllers/job.controller.js

const Typejob = require('../models/typejob');

// Thêm mới Typejob
exports.createTypejob = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.length > 50) {
      return res.status(400).json({ message: 'Tên phải là chuỗi và tối đa 50 ký tự' });
    }

    const newTypejob = new Typejob({
      name: req.body.name,
      owner: req.user.id
    });

    const saved = await newTypejob.save();
    res.status(201).json({ message: 'Thêm loại công việc thành công', data: saved });
  } catch (error) {
    console.error('❌ Lỗi khi thêm typejob:', error);
    res.status(500).json({ message: 'Lỗi khi thêm loại công việc', error });
  }
};

// Lấy danh sách Typejob
exports.getTypejob = async (req, res) => {
  try {
    const list = await Typejob.find({ owner: req.user.id });
    res.status(200).json({ message: 'Danh sách loại công việc', data: list });
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách typejob:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách loại công việc', error });
  }
};

// Cập nhật Typejob
exports.updateTypejob = async (req, res) => {
  const id = req.params.id; // ❌ Bỏ parseInt
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.length > 50) {
    return res.status(400).json({ message: 'Tên phải là chuỗi và tối đa 50 ký tự' });
  }

  try {
    const updated = await Typejob.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy loại công việc' });
    }

    res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật typejob:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật loại công việc', error });
  }
};

// Xóa Typejob
exports.deleteTypejob = async (req, res) => {
  const id = req.params.id; // ❌ Bỏ parseInt

  try {
    const deleted = await Typejob.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy loại công việc để xóa' });
    }

    res.json({ message: 'Xóa thành công', data: deleted });
  } catch (error) {
    console.error('❌ Lỗi khi xóa typejob:', error);
    res.status(500).json({ message: 'Lỗi khi xóa loại công việc', error });
  }
};
