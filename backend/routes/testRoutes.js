const express = require('express');
const router = express.Router();
const {
  createTest,
  getTeacherTests,
  getTestDetails,
  updateTest,
  deleteTest,
  publishTest,
  getTestResults,
  addQuestionsToTest
} = require('../controllers/testController');

const auth = require('../middlewares/auth');


const roleMiddleware = require('../middlewares/role');


router.use(auth);
router.use(roleMiddleware('teacher'));

router.post('/', createTest);
router.post('/:testId/questions', addQuestionsToTest);
router.get('/teacher', getTeacherTests);
router.get('/:testId', getTestDetails);
router.put('/:testId', updateTest);
router.delete('/:testId', deleteTest);
router.patch('/:testId/publish', publishTest);
router.get('/:testId/results', getTestResults);

module.exports = router;
