const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/student/signup', authController.studentSignup);
router.post('/teacher/signup', authController.teacherSignup);
router.post('/login', authController.login);
router.get('/students',authController.getAllStudents);

module.exports = router;