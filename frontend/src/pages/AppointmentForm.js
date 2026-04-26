/**
 * AppointmentForm Page
 * Book an appointment with a doctor
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AppointmentForm.css';

function AppointmentForm() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: searchParams.get('doctorId') || '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime || !formData.reason) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/appointments', formData);
      if (response.data.success) {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="appointment-form-page">
      <div className="form-container">
        <h1>Book an Appointment</h1>
        <p>Schedule your consultation with our expert doctors</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="doctorId">Select Doctor *</label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date *</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Appointment Time *</label>
              <input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Appointment *</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit"
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>

      <div className="appointment-info">
        <h3>Important Information</h3>
        <ul>
          <li>Please arrive 10 minutes before your appointment time</li>
          <li>Bring your medical insurance card if applicable</li>
          <li>Avoid heavy meals before your appointment</li>
          <li>Bring any previous medical records if available</li>
          <li>You will receive a confirmation email shortly</li>
        </ul>
      </div>
    </div>
  );
}

export default AppointmentForm;
