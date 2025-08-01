//backend/model/typejob.js

const mongoose = require('mongoose');
const Counter = require('./counter');

const TypejobSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, maxlength: 50, required: true },
  owner: { type: Number, ref: 'User', required: true } 
});

TypejobSchema.index({ name: 1, owner: 1 }, { unique: true });

let tempCounter = null; 

// Tự động tăng ID trước khi lưu
TypejobSchema.pre('save', async function (next) {
  if (this.isNew && (this._id === undefined || this._id === null)) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'typejob' },
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

// Reset biến rollback nếu lưu thành công
TypejobSchema.post('save', function (doc, next) {
  tempCounter = null;
  next();
});

// Nếu lỗi, rollback lại ID
TypejobSchema.post('error', async function (error, doc, next) {
  if (tempCounter !== null) {
    await Counter.findByIdAndUpdate(
      { _id: 'typejob' },
      { $inc: { seq: -1 } }
    );
    tempCounter = null;
  }
  next(error);
});

module.exports = mongoose.model('Typejob', TypejobSchema);
