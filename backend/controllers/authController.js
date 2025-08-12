const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// Student signup
exports.studentSignup = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department } = req.body;
    
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      rollNumber,
      department
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'student' } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Teacher signup
exports.teacherSignup = async (req, res) => {
  try {
    const { name, email, password, teacherId, department } = req.body;
    
    const user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      teacherId,
      department
    });

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'teacher' } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// View all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
};
