import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees. Please check if backend is running.');
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
    
    if (!formData.employeeId || !formData.fullName || !formData.email || !formData.department) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post(`${API_URL}/employees`, formData);
      setFormData({ employeeId: '', fullName: '', email: '', department: '' });
      setShowForm(false);
      fetchEmployees();
      setError('');
      alert('Employee added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/employees/${id}`);
        fetchEmployees();
        alert('Employee deleted successfully!');
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="employee-management">
      <div className="section-header">
        <h2>Employee Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ Cancel' : '➕ Add Employee'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h3>Add New Employee</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="e.g., EMP001"
                required
              />
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., john@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Engineering"
                required
              />
            </div>

            <button type="submit" className="btn-submit">Add Employee</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h3>Employee List ({employees.length})</h3>
        {employees.length === 0 ? (
          <div className="empty-state">
            <p>📭 No employees found</p>
            <p>Click "Add Employee" to get started</p>
          </div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(employee._id)}
                    >
                      🗑️ Delete
                    </button>
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

export default EmployeeManagement;
