require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


connectDB();

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const resultRoutes = require('./routes/resultRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));