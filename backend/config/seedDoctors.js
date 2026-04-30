/**
 * Seed Doctors
 * Creates a small set of doctors when the database is empty.
 */

const Doctor = require('../models/Doctor');

const DOCTORS = [
  // Cardiology Doctors
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
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    specialization: 'Cardiology',
    qualifications: 'MBBS, DM Cardiology',
    experience: 15,
    consultationFee: 850,
    rating: 4.9,
    phone: '9876500016',
  },
  {
    name: 'Dr. Anjali Desai',
    email: 'anjali.desai@hospital.com',
    specialization: 'Cardiology',
    qualifications: 'MBBS, MD Cardiology, Fellowship',
    experience: 18,
    consultationFee: 900,
    rating: 4.7,
    phone: '9876500017',
  },

  // Neurology Doctors
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
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@hospital.com',
    specialization: 'Neurology',
    qualifications: 'MBBS, MD Neurology',
    experience: 14,
    consultationFee: 950,
    rating: 4.8,
    phone: '9876500018',
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'neha.kapoor@hospital.com',
    specialization: 'Neurology',
    qualifications: 'MBBS, DM Neurology, Fellowship',
    experience: 11,
    consultationFee: 1000,
    rating: 4.6,
    phone: '9876500019',
  },

  // Orthopedics Doctors
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
    name: 'Dr. Rohan Patel',
    email: 'rohan.patel@hospital.com',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MS Orthopedics',
    experience: 13,
    consultationFee: 800,
    rating: 4.8,
    phone: '9876500020',
  },
  {
    name: 'Dr. Kavya Nair',
    email: 'kavya.nair@hospital.com',
    specialization: 'Orthopedics',
    qualifications: 'MBBS, MCh Orthopedic Surgery',
    experience: 16,
    consultationFee: 850,
    rating: 4.7,
    phone: '9876500021',
  },

  // General Medicine Doctors
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
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@hospital.com',
    specialization: 'General',
    qualifications: 'MBBS, MD General Medicine',
    experience: 10,
    consultationFee: 550,
    rating: 4.6,
    phone: '9876500022',
  },
  {
    name: 'Dr. Divya Mishra',
    email: 'divya.mishra@hospital.com',
    specialization: 'General',
    qualifications: 'MBBS, MD General Medicine',
    experience: 12,
    consultationFee: 600,
    rating: 4.7,
    phone: '9876500023',
  },

  // Pediatrics Doctors
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
  {
    name: 'Dr. Arun Verma',
    email: 'arun.verma@hospital.com',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, MD Pediatrics',
    experience: 9,
    consultationFee: 650,
    rating: 4.8,
    phone: '9876500024',
  },
  {
    name: 'Dr. Shreya Bhat',
    email: 'shreya.bhat@hospital.com',
    specialization: 'Pediatrics',
    qualifications: 'MBBS, MD Pediatrics, Fellowship',
    experience: 13,
    consultationFee: 750,
    rating: 4.7,
    phone: '9876500025',
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