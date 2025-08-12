const express = require('express');
const router = express.Router();
const {
  getStudentTests,
  startAttempt,
  submitAttempt
} = require('../controllers/attemptController');
const auth = require('../middlewares/auth');

const roleMiddleware = require('../middlewares/role');

router.use(auth);
router.use(roleMiddleware('student'));


router.get('/student', getStudentTests);
router.post('/', startAttempt);
router.post('/:attemptId/submit', submitAttempt);

module.exports = router;