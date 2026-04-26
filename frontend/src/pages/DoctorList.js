/**
 * DoctorList Page
 * Display all doctors with ability to filter by specialization
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DoctorCard from '../components/DoctorCard';
import './DoctorList.css';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const specializations = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General'];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.doctors);
        setFilteredDoctors(response.data.doctors);
      }
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationFilter = (specialization) => {
    setSelectedSpecialization(specialization);
    if (specialization === 'All') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter((doc) => doc.specialization === specialization));
    }
  };

  const handleBookAppointment = (doctorId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to book an appointment');
      navigate('/login');
    } else {
      navigate(`/appointment?doctorId=${doctorId}`);
    }
  };

  return (
    <div className="doctor-list-page">
      <div className="doctor-list-header">
        <h1>Our Expert Doctors</h1>
        <p>Book an appointment with our qualified healthcare professionals</p>
      </div>

      <div className="doctor-filters">
        <h3>Filter by Specialization:</h3>
        <div className="filter-buttons">
          {specializations.map((spec) => (
            <button
              key={spec}
              className={`filter-btn ${selectedSpecialization === spec ? 'active' : ''}`}
              onClick={() => handleSpecializationFilter(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Loading doctors...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredDoctors.length > 0 ? (
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onBook={handleBookAppointment}
            />
          ))}
        </div>
      ) : (
        <p className="no-doctors">No doctors found in this specialization.</p>
      )}
    </div>
  );
}

export default DoctorList;
