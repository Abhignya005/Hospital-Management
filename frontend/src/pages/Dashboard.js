/**
 * Dashboard Page
 * User overview after login
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pastAppointments: 0,
    prescriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/appointments');
      if (response.data.success) {
        const appointments = response.data.appointments;
        const today = new Date();

        const upcoming = appointments.filter(
          (apt) => new Date(apt.appointmentDate) >= today
        ).length;
        const past = appointments.filter(
          (apt) => new Date(apt.appointmentDate) < today
        ).length;

        setStats({
          upcomingAppointments: upcoming,
          pastAppointments: past,
          prescriptions: Math.floor(Math.random() * 5), // Placeholder
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Here's an overview of your health management</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <h3>Upcoming Appointments</h3>
              <p className="stat-number">{stats.upcomingAppointments}</p>
              <Link to="/appointment" className="stat-link">
                Book New →
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <h3>Past Appointments</h3>
              <p className="stat-number">{stats.pastAppointments}</p>
              <Link to="/profile" className="stat-link">
                View History →
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💊</div>
              <h3>Active Prescriptions</h3>
              <p className="stat-number">{stats.prescriptions}</p>
              <Link to="/pharmacy" className="stat-link">
                View Meds →
              </Link>
            </div>
          </div>

          <div className="dashboard-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/doctors" className="action-button">
                👨‍⚕️ Find Doctors
              </Link>
              <Link to="/appointment" className="action-button">
                📋 Book Appointment
              </Link>
              <Link to="/pharmacy" className="action-button">
                💊 Order Medicines
              </Link>
              <Link to="/profile" className="action-button">
                👤 My Profile
              </Link>
            </div>
          </div>

          <div className="dashboard-info">
            <h2>Health Tips</h2>
            <div className="tips-container">
              <div className="tip-card">
                <p>💧 Drink at least 8 glasses of water daily</p>
              </div>
              <div className="tip-card">
                <p>🏃 Exercise for at least 30 minutes daily</p>
              </div>
              <div className="tip-card">
                <p>😴 Get 7-8 hours of quality sleep</p>
              </div>
              <div className="tip-card">
                <p>🥗 Maintain a balanced and healthy diet</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
