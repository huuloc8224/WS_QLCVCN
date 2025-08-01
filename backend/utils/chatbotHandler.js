const Job = require('../models/job')
const TypeJob = require('../models/typejob')
const moment = require('moment')

module.exports = async (req, res) => {
  const msg = req.body.message.toLowerCase()

  try {
    // Tạo loại công việc
    const type = await TypeJob.findOne({ name: typeName.trim() });
if (!type) {
  const newType = await TypeJob.create({
    name: typeName.trim(),
    owner: "CHATBOT_OWNER_ID", // Thay bằng _id của user nào đó mặc định
  });
}

    // Tạo công việc: "tạo công việc abc thuộc loại xyz hết hạn 10/08/2025"
if (msg.includes('tạo công việc')) {
  const regex = /tạo công việc (.*?) thuộc loại (.*?) hết hạn (.*)/i;
  const match = msg.match(regex);

  if (!match) {
    return res.json({ reply: 'Cú pháp không đúng. Hãy nhập: "tạo công việc [tên] thuộc loại [loại] hết hạn [dd/mm/yyyy]"' });
  }

  const [, title, typeName, deadlineStr] = match;

  const type = await TypeJob.findOne({ name: typeName.trim() });
  if (!type) return res.json({ reply: `Loại "${typeName}" không tồn tại.` });

  const deadline = moment(deadlineStr, 'DD/MM/YYYY', true);
  if (!deadline.isValid()) return res.json({ reply: `Ngày hết hạn "${deadlineStr}" không hợp lệ. Định dạng đúng: dd/mm/yyyy` });

  const job = await Job.create({
    title,
    deadline: deadline.toDate(),
    typeJob: type._id,
    status: 'pending',
    description: '',
    createdAt: new Date()
  });

  return res.json({ reply: `Đã tạo công việc "${title}" hết hạn ngày ${deadlineStr}` });
}


    // Tổng hợp công việc theo ngày
    if (msg.includes('tổng hợp ngày')) {
      const today = moment().startOf('day')
      const tomorrow = moment(today).add(1, 'day')
      const jobs = await Job.find({
        deadline: { $gte: today.toDate(), $lt: tomorrow.toDate() }
      }).populate('typeJob')

      if (jobs.length === 0) return res.json({ reply: 'Hôm nay không có công việc nào.' })

      const list = jobs.map(job => `- ${job.title} (${job.typeJob.name})`).join('\n')
      return res.json({ reply: `Hôm nay có ${jobs.length} công việc:\n${list}` })
    }

    return res.json({ reply: 'Tôi chưa hiểu bạn muốn làm gì. Hãy thử lại.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ reply: 'Lỗi xử lý yêu cầu!' })
  }
}
