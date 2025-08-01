const Job = require('../models/job')
const TypeJob = require('../models/typejob')
const moment = require('moment')

module.exports = async (req, res) => {
  const msg = req.body.message.toLowerCase()

  try {
    // Tạo loại công việc
    if (msg.includes('tạo loại')) {
      const name = msg.split('tạo loại')[1].trim()
      const exists = await TypeJob.findOne({ name })
      if (exists) return res.json({ reply: `Loại "${name}" đã tồn tại.` })

      const newType = await TypeJob.create({ name })
      return res.json({ reply: `Đã tạo loại công việc: ${newType.name}` })
    }

    // Tạo công việc: "tạo công việc abc thuộc loại xyz hết hạn 10/08/2025"
    if (msg.includes('tạo công việc')) {
      const regex = /tạo công việc (.*?) thuộc loại (.*?) hết hạn (.*)/
      const [, title, typeName, deadlineStr] = msg.match(regex) || []

      const type = await TypeJob.findOne({ name: typeName.trim() })
      if (!type) return res.json({ reply: `Loại "${typeName}" không tồn tại.` })

      const deadline = moment(deadlineStr, 'DD/MM/YYYY').toDate()

      const job = await Job.create({
        title,
        deadline,
        typeJob: type._id,
        status: 'pending',
        description: '',
        createdAt: new Date()
      })

      return res.json({ reply: `Đã tạo công việc "${title}" hết hạn ngày ${deadlineStr}` })
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
