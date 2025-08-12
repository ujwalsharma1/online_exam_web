const express = require('express');
const router = express.Router();
const {
  getStudentResults,
  getDetailedResult,
  getAllTestResults,
  getTestResults
} = require('../controllers/resultController');
const auth = require('../middlewares/auth');



router.use(auth);

router.get('/student', getStudentResults);    
router.get('/all-tests', getAllTestResults);     
router.get('/test/:testId', getTestResults);      
router.get('/:attemptId', getDetailedResult);      

module.exports = router;