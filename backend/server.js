const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));



// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yuvrajrathi2005_db_user:Hrms2024@cluster0.cdaqjhy.mongodb.net/hrms-lite?retryWrites=true&w=majority';



console.log('🔍 MONGODB_URI:', MONGODB_URI);



mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import Routes
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Use Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'HRMS Lite API is running!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
