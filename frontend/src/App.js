import React, { useState } from 'react';
import './App.css';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';

function App() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏢 HRMS Lite</h1>
        <p>Human Resource Management System</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'employees' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('employees')}
        >
          👥 Employee Management
        </button>
        <button 
          className={activeTab === 'attendance' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('attendance')}
        >
          📋 Attendance Management
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'attendance' && <AttendanceManagement />}
      </main>

      <footer className="app-footer">
        <p>© 2026 HRMS Lite | Built for HR Operations</p>
      </footer>
    </div>
  );
}

export default App;
