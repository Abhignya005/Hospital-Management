/**
 * Seed Doctors
 * Creates a small set of doctors when the database is empty.
 */

const Doctor = require('../models/Doctor');

const DOCTORS = [
  {
    name: 'Dr. Priya Reddy',
    email: 'priya.reddy@hospital.com',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD Cardiology',
    experience: 12,
    consultationFee: 800,
    rating: 4.8,
    phone: '9876500011',
  },
  {
    name: 'Dr. Arjun Mehta',
    email: 'arjun.mehta@hospital.com',
    specialization: 'Neurology',
    qualifications: 'MBBS, DM Neurology',
    experience: 10,
    consultationFee: 900,
    rating: 4.7,
    phone: '9876500012',
  },
  {
    name: 'Dr. Sneha Sharma',
    email: 'sneha.sharma@hospital.com',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MS Orthopedics',
    experience: 9,
    consultationFee: 750,
    rating: 4.6,
    phone: '9876500013',
  },
  {
    name: 'Dr. Kiran Rao',
    email: 'kiran.rao@hospital.com',
    specialization: 'General',
    qualifications: 'MBBS, DNB General Medicine',
    experience: 14,
    consultationFee: 500,
    rating: 4.5,
    phone: '9876500014',
  },
  {
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@hospital.com',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, MD Pediatrics',
    experience: 11,
    consultationFee: 700,
    rating: 4.9,
    phone: '9876500015',
  },
];

const seedDoctors = async () => {
  const doctorCount = await Doctor.countDocuments();

  if (doctorCount > 0) {
    return;
  }

  await Doctor.insertMany(DOCTORS);
  console.log(`Seeded ${DOCTORS.length} doctors`);
};

module.exports = seedDoctors;