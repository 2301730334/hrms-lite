import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AttendanceManagement() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/attendance`);
      setAttendance(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.date || !formData.status) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post(`${API_URL}/attendance`, formData);
      setFormData({
        employeeId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      setShowForm(false);
      fetchAttendance();
      setError('');
      alert('Attendance marked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const filterAttendanceByEmployee = (employeeId) => {
    if (!employeeId) return attendance;
    return attendance.filter(record => record.employeeId === employeeId);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee ? employee.fullName : employeeId;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const displayedAttendance = selectedEmployee 
    ? filterAttendanceByEmployee(selectedEmployee) 
    : attendance;

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="attendance-management">
      <div className="section-header">
        <h2>Attendance Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ Cancel' : '✏️ Mark Attendance'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h3>Mark Attendance</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Employee *</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.employeeId}>
                    {employee.employeeId} - {employee.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">Mark Attendance</button>
          </form>
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Employee:</label>
        <select 
          value={selectedEmployee} 
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="filter-select"
        >
          <option value="">All Employees</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee.employeeId}>
              {employee.employeeId} - {employee.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <h3>Attendance Records ({displayedAttendance.length})</h3>
        {displayedAttendance.length === 0 ? (
          <div className="empty-state">
            <p>📭 No attendance records found</p>
            <p>Click "Mark Attendance" to get started</p>
          </div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{record.employeeId}</td>
                  <td>{getEmployeeName(record.employeeId)}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status === 'Present' ? '✅' : '❌'} {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceManagement;
