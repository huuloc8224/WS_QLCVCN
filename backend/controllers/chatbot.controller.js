const Job = require('../models/job');
const TypeJob = require('../models/typejob');
const moment = require('moment');

module.exports = async (req, res) => {
  const msg = req.body.message.toLowerCase();

  try {
    // ===== Tạo công việc =====
    if (msg.includes('tạo công việc')) {
      const regex = /tạo công việc (.*?) thuộc loại (.*?) hết hạn (.*)/i;
      const match = msg.match(regex);

      if (!match) {
        return res.json({
          reply: 'Cú pháp không đúng. Nhập: "tạo công việc [tên] thuộc loại [loại] hết hạn [dd/mm/yyyy]"'
        });
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

      // Xử lý ngày
      const deadline = moment(deadlineStr, 'DD/MM/YYYY', true);
      if (!deadline.isValid()) {
        return res.json({ reply: `Ngày hết hạn "${deadlineStr}" không hợp lệ. Đúng định dạng: dd/mm/yyyy` });
      }

      // Tạo công việc
      const job = await Job.create({
        title,
        description: '',
        start_date: new Date(),
        due_date: deadline.toDate(),
        typejob: type._id,
        status: 'todo',
        owner: req.user.id,
      });

      return res.json({
        reply: `✅ Đã tạo công việc "${title}" thuộc loại "${type.name}" hết hạn ${deadlineStr}`
      });
    }

    // ===== Tổng hợp công việc hôm nay =====
    if (msg.includes('tổng hợp ngày')) {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(1, 'day');

      const filter = {
        due_date: { $gte: today.toDate(), $lt: tomorrow.toDate() },
      };

      if (req.user?.id) filter.owner = req.user.id;

      const jobs = await Job.find(filter).populate('typejob');

      if (jobs.length === 0) {
        return res.json({ reply: '📭 Hôm nay không có công việc nào hạn cuối.' });
      }

      const list = jobs.map(job => `- ${job.title} (${job.typejob.name})`).join('\n');
      return res.json({
        reply: `📌 Hôm nay có ${jobs.length} công việc hạn cuối:\n${list}`
      });
    }

    // ===== Không nhận diện được =====
    return res.json({
      reply: '🤖 Tôi chưa hiểu bạn muốn làm gì. Hãy thử lệnh "tạo công việc..." hoặc "tổng hợp ngày".'
    });

  } catch (err) {
    console.error('💥 Lỗi xử lý chatbot:', err);
    res.status(500).json({ reply: '💥 Lỗi xử lý yêu cầu!' });
  }
};
