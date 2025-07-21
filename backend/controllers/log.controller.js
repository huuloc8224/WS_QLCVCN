const Log = require('../models/log');

const statusMap = {
  todo: 'Chưa thực hiện',
  in_progress: 'Đang thực hiện',
  done: 'Đã hoàn thành',
};

const logAction = async (userId, job, action, details) => {
  await Log.create({
    action,
    jobId: job._id,
    jobTitle: job.title,
    userId,
    details,
  });
};

module.exports = {
  logAction,
  statusMap,
};
