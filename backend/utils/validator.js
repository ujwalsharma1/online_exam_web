const { check, validationResult } = require('express-validator');

const validateStudentSignup = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('rollNumber').notEmpty().withMessage('Roll number is required'),
  check('department').notEmpty().withMessage('Department is required')
];

const validateTeacherSignup = [
  
];

const validateLogin = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required')
];

const validateTestCreation = [
 
];

module.exports = {
  validateStudentSignup,
  validateTeacherSignup,
  validateLogin,
  validateTestCreation,
  validationResult
};