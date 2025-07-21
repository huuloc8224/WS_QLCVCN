const router = require('express').Router();
const jobController = require('../controllers/job.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);

// Lấy tất cả công việc
router.get('/all', jobController.getAllJobs);

// Lọc công việc theo typejob (?typejob=1)
router.get('/', jobController.getJobByTypejob);

// Lấy theo tên loại công việc
router.get('/typejob/name/:typejobName', jobController.getJobByTypejobName);

// Tạo mới
router.post('/create', jobController.createJob);

// Cập nhật
router.put('/:id', jobController.updateJob);

// Xoá
router.delete('/:id', jobController.deleteJob);

module.exports = router;
