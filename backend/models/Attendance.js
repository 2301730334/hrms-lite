const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    ref: 'Employee'
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Present', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance entries for same employee on same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
