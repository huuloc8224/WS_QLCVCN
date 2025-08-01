const Job = require('../models/job');
const TypeJob = require('../models/typejob');
const moment = require('moment');

module.exports = async (req, res) => {
  const msg = req.body.message.toLowerCase();

  try {
    // Tạo công việc: "tạo công việc abc thuộc loại xyz hết hạn 10/08/2025"
    if (msg.includes('tạo công việc')) {
      const regex = /tạo công việc (.*?) thuộc loại (.*?) hết hạn (.*)/i;
      const match = msg.match(regex);

      if (!match) {
        return res.json({ reply: 'Cú pháp không đúng. Nhập: "tạo công việc [tên] thuộc loại [loại] hết hạn [dd/mm/yyyy]"' });
      }

      const [, title, typeName, deadlineStr] = match;

      // Lấy hoặc tạo loại công việc
      let type = await TypeJob.findOne({ name: typeName.trim() });
      if (!type) {
        type = await TypeJob.create({
          name: typeName.trim(),
          owner: req.user?.id || 'CHATBOT_OWNER_ID',
        });
      }

      const deadline = moment(deadlineStr, 'DD/MM/YYYY', true);
      if (!deadline.isValid()) {
        return res.json({ reply: `Ngày hết hạn "${deadlineStr}" không hợp lệ. Đúng định dạng: dd/mm/yyyy` });
      }

      const job = await Job.create({
        title,
        due_date: deadline.toDate(),
        start_date: new Date(),
        status: 'chưa làm',
        typejob: type._id,
        owner: req.user.id,
        createdAt: new Date()
      });

      return res.json({ reply: `✅ Đã tạo công việc "${title}" thuộc loại "${type.name}" hết hạn ${deadlineStr}` });
    }

    // Tổng hợp công việc hôm nay
    if (msg.includes('tổng hợp ngày')) {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'day');

      const filter = {
        deadline: { $gte: today.toDate(), $lt: tomorrow.toDate() },
      };

      // Nếu có người dùng xác thực thì lọc theo owner
      if (req.user?.id) filter.owner = req.user.id;

      const jobs = await Job.find(filter).populate('typeJob');

      if (jobs.length === 0) {
        return res.json({ reply: '📭 Hôm nay không có công việc nào.' });
      }

      const list = jobs.map(job => `- ${job.title} (${job.typeJob.name})`).join('\n');
      return res.json({ reply: `📌 Hôm nay có ${jobs.length} công việc:\n${list}` });
    }

    // Câu lệnh không nhận diện được
    return res.json({ reply: '🤖 Tôi chưa hiểu bạn muốn làm gì. Hãy thử lệnh "tạo công việc..." hoặc "tổng hợp ngày".' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: '💥 Lỗi xử lý yêu cầu!' });
  }
};
