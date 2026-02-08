const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

// Get attendance for specific employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      employeeId: req.params.employeeId 
    }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // Validation
    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: 'Employee ID, date, and status are required' });
    }

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if status is valid
    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Present or Absent' });
    }

    // Create attendance record
    const attendance = new Attendance({
      employeeId,
      date: new Date(date),
      status
    });

    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - attendance already marked for this date
      res.status(400).json({ message: 'Attendance already marked for this employee on this date' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
  }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance', error: error.message });
  }
});

module.exports = router;
