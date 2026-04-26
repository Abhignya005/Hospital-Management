/**
 * DoctorCard Component
 * Display individual doctor information
 */

import React from 'react';
import './DoctorCard.css';

function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card-header">
        <div className="doctor-avatar">👨‍⚕️</div>
      </div>

      <div className="doctor-card-body">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>

        <div className="doctor-info">
          <p>
            <strong>Experience:</strong> {doctor.experience} years
          </p>
          <p>
            <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {doctor.rating}/5
          </p>
          {doctor.qualifications && (
            <p>
              <strong>Qualifications:</strong> {doctor.qualifications}
            </p>
          )}
        </div>

        <div className="doctor-availability">
          <strong>Available:</strong> {doctor.availability.join(', ')}
        </div>

        <button className="doctor-book-btn" onClick={() => onBook(doctor._id)}>
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default DoctorCard;
