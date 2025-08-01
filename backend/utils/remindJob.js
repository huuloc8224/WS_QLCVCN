const cron = require('node-cron')
const Job = require('../models/job')
const moment = require('moment')
const sendMail = require('./sendNotification') // đã có logic gửi

cron.schedule('0 8 * * *', async () => {
  const now = moment()
  const near = moment().add(3, 'days')

  const jobsExpiring = await Job.find({
    deadline: { $gte: now.toDate(), $lte: near.toDate() }
  })

  const jobsExpired = await Job.find({
    deadline: { $lt: now.toDate() }
  })

  for (let job of jobsExpiring) {
    await sendMail(job.assigneeEmail, `Sắp hết hạn: ${job.title}`, `Hạn: ${moment(job.deadline).format('DD/MM/YYYY')}`)
  }

  for (let job of jobsExpired) {
    await sendMail(job.assigneeEmail, `Đã hết hạn: ${job.title}`, `Hết hạn: ${moment(job.deadline).format('DD/MM/YYYY')}`)
  }

  console.log('Gửi mail nhắc việc thành công.')
})
