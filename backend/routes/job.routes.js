// ✅ backend/routes/job.routes.js (RESTful chuẩn)
const router = require('express').Router();
const jobController = require('../controllers/job.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

// Lấy tất cả công việc của người dùng
router.get('/jobs', jobController.getAllJobs);

// Lọc công việc theo typejob (?typejob=1)
router.get('/jobs/filter', jobController.getJobByTypejob);

// Lấy công việc theo tên loại công việc
router.get('/jobs/type/name/:typejobName', jobController.getJobByTypejobName);

// Tạo mới công việc
router.post('/jobs', jobController.createJob);

// Cập nhật công việc
router.put('/jobs/:id', jobController.updateJob);

// Xoá công việc
router.delete('/jobs/:id', jobController.deleteJob);

module.exports = router;