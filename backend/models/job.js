const mongoose = require('mongoose');
const Counter = require('./counter');

const jobSchema = new mongoose.Schema({
  _id: Number,
  title: { type: String, maxlength: 50, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  },
  typejob: { type: Number, ref: 'Typejob', required: true },
  start_date: { type: Date, required: true }, // ← THÊM: ngày bắt đầu
  due_date: { type: Date, required: true },   // ← Đảm bảo là bắt buộc
  owner: { type: Number, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
});

// Tự tăng _id
let tempCounter = null;

jobSchema.pre('save', async function (next) {
  if (this.isNew && (this._id === undefined || this._id === null)) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'job' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this._id = counter.seq;
      tempCounter = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

jobSchema.post('save', function (doc, next) {
  tempCounter = null;
  next();
});

jobSchema.post('error', async function (error, doc, next) {
  if (tempCounter !== null) {
    await Counter.findByIdAndUpdate({ _id: 'job' }, { $inc: { seq: -1 } });
    tempCounter = null;
  }
  next(error);
});

module.exports = mongoose.model('Job', jobSchema);
