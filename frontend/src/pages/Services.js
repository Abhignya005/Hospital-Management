/**
 * Services Page
 * Detailed information about all hospital services
 */

import React from 'react';
import './Services.css';

function Services() {
  const services = [
    {
      id: 1,
      title: 'Emergency Services',
      description: 'Round-the-clock emergency care for critical and life-threatening situations.',
      features: ['24/7 Available', 'Expert Emergency Team', 'Advanced Equipment'],
      icon: '🚑',
    },
    {
      id: 2,
      title: 'Cardiology',
      description: 'Specialized heart and cardiovascular disease treatment and prevention.',
      features: ['Heart Surgery', 'Cardiac Imaging', 'Arrhythmia Treatment'],
      icon: '❤️',
    },
    {
      id: 3,
      title: 'Neurology',
      description: 'Comprehensive care for neurological disorders and brain health.',
      features: ['Brain Surgery', 'Neuromuscular Disorders', 'Stroke Treatment'],
      icon: '🧠',
    },
    {
      id: 4,
      title: 'Orthopedics',
      description: 'Treatment of bone, joint, and musculoskeletal system disorders.',
      features: ['Joint Replacement', 'Fracture Treatment', 'Sports Medicine'],
      icon: '🦴',
    },
    {
      id: 5,
      title: 'Pediatrics',
      description: 'Specialized medical care for infants, children, and adolescents.',
      features: ['Child Health', 'Vaccination', 'Growth Monitoring'],
      icon: '👶',
    },
    {
      id: 6,
      title: 'General Medicine',
      description: 'Comprehensive primary healthcare and general medical treatment.',
      features: ['Health Check-ups', 'Chronic Disease Management', 'Preventive Care'],
      icon: '⚕️',
    },
    {
      id: 7,
      title: 'Dental Care',
      description: 'Complete dental health services from routine care to advanced procedures.',
      features: ['Teeth Cleaning', 'Root Canal', 'Implants'],
      icon: '🦷',
    },
    {
      id: 8,
      title: 'Pharmacy Services',
      description: 'Convenient access to a wide range of medicines and health products.',
      features: ['Quick Delivery', 'Prescription Support', 'Generic Alternatives'],
      icon: '💊',
    },
  ];

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Hospital Services</h1>
        <p>Comprehensive healthcare solutions tailored to your needs</p>
      </div>

      <div className="services-container">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-card-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-features">
              <h4>Key Features:</h4>
              <ul>
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <section className="services-cta">
        <h2>Need Any of Our Services?</h2>
        <p>Book an appointment with our expert doctors today</p>
        <button className="cta-button">Schedule Now</button>
      </section>
    </div>
  );
}

export default Services;
