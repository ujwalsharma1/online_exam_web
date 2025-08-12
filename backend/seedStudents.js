require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedStudents = async () => {
  await connectDB();

  const students = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'student',
      rollNumber: '21CS001',
      department: 'CSE'
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'password123',
      role: 'student',
      rollNumber: '21CS002',
      department: 'CSE'
    },
    {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'password123',
      role: 'student',
      rollNumber: '21IT001',
      department: 'IT'
    },
  ];

  for (const student of students) {
    const hashedPassword = await bcrypt.hash(student.password, 12);
    student.password = hashedPassword;
    await User.create(student);
  }

  console.log('✅ Seeded students');
  mongoose.disconnect();
};

seedStudents().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  mongoose.disconnect();
});
