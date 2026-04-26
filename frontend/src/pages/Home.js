/**
 * Home Page
 * Landing page with introduction and services overview
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Hospital Management System</h1>
          <p className="hero-subtitle">
            Your health is our priority. Book appointments, consult doctors, and manage your medical records all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/doctors" className="btn btn-primary">
              View Our Doctors
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-overview">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-item">
            <div className="service-icon">👨‍⚕️</div>
            <h3>Expert Doctors</h3>
            <p>
              Consult with highly qualified and experienced doctors from various specializations.
            </p>
          </div>

          <div className="service-item">
            <div className="service-icon">📋</div>
            <h3>Book Appointments</h3>
            <p>
              Easy online appointment booking system with flexible scheduling options.
            </p>
          </div>

          <div className="service-item">
            <div className="service-icon">💊</div>
            <h3>Pharmacy Services</h3>
            <p>
              Order medicines online with home delivery and prescription management.
            </p>
          </div>

          <div className="service-item">
            <div className="service-icon">📱</div>
            <h3>Online Consultation</h3>
            <p>
              Consult with doctors remotely from the comfort of your home.
            </p>
          </div>

          <div className="service-item">
            <div className="service-icon">📊</div>
            <h3>Medical Records</h3>
            <p>
              Maintain and access your medical records digitally in one secure place.
            </p>
          </div>

          <div className="service-item">
            <div className="service-icon">🔔</div>
            <h3>Appointment Reminders</h3>
            <p>
              Receive timely reminders for your upcoming appointments and medication refills.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Start Managing Your Health Today</h2>
        <p>Join thousands of patients who trust us with their healthcare needs.</p>
        <Link to="/signup" className="btn btn-primary btn-large">
          Create Your Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
