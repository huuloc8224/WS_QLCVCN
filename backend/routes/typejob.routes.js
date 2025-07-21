//backend/routes/typejob.routes.js

const router = require('express').Router();
const typejobController = require('../controllers/typejob.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.post('/', typejobController.createTypejob);
router.get('/', typejobController.getTypejob);
router.put('/:id', typejobController.updateTypejob);     // ✅ cập nhật typejob
router.delete('/:id', typejobController.deleteTypejob); // ✅ xóa typejob

module.exports = router;
