const mongoose = require('mongoose');
const Counter = require('./counter');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, maxlength: 50 },
  email: { type: String, maxlength: 255, unique: true },
  password: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now }
});

let tempCounter = null;

userSchema.pre('save', async function (next) {
  if (this.isNew && (this._id === undefined || this._id === null)) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'user' },
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

userSchema.post('save', function (doc, next) {
  tempCounter = null;
  next();
});

userSchema.post('save', function (error, doc, next) {
  if (error) {
    return next(error);
  }
  next();
});

userSchema.post('error', async function (error, doc, next) {
  if (tempCounter !== null) {
    await Counter.findByIdAndUpdate(
      { _id: 'user' },
      { $inc: { seq: -1 } }
    );
    tempCounter = null;
  }
  next(error);
});

module.exports = mongoose.model('User', userSchema);
