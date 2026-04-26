/**
 * Profile Page
 * User information and appointment history
 */

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Profile.css';

function Profile({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserAppointments();
  }, []);

  const fetchUserAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await api.delete(`/appointments/${appointmentId}`);
        if (response.data.success) {
          alert('Appointment cancelled successfully');
          fetchUserAppointments();
        }
      } catch (err) {
        alert('Failed to cancel appointment');
        console.error('Error:', err);
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          {user?.phone && <p>📞 {user?.phone}</p>}
        </div>
      </div>

      <div className="profile-details">
        <div className="details-card">
          <h2>Personal Information</h2>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user?.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{user?.phone}</span>
            </div>
          )}
          {user?.age && (
            <div className="detail-row">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{user?.age}</span>
            </div>
          )}
          {user?.gender && (
            <div className="detail-row">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{user?.gender}</span>
            </div>
          )}
          {user?.address && (
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{user?.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="appointments-section">
        <h2>Appointment History</h2>

        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : appointments.length > 0 ? (
          <div className="appointments-table">
            <div className="table-header">
              <div className="table-cell">Doctor</div>
              <div className="table-cell">Date</div>
              <div className="table-cell">Time</div>
              <div className="table-cell">Reason</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Action</div>
            </div>

            {appointments.map((apt) => (
              <div key={apt._id} className="table-row">
                <div className="table-cell">{apt.doctorId?.name}</div>
                <div className="table-cell">
                  {new Date(apt.appointmentDate).toLocaleDateString()}
                </div>
                <div className="table-cell">{apt.appointmentTime}</div>
                <div className="table-cell">{apt.reason}</div>
                <div className="table-cell">
                  <span className={`status-badge status-${apt.status}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="table-cell">
                  {apt.status === 'pending' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelAppointment(apt._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-appointments">No appointments yet. Book one now!</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
