/**
 * Doctor Model
 * Stores doctor information
 */

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General'],
    },
    qualifications: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: null,
    },
    experience: {
      type: Number, // Years of experience
      default: 0,
    },
    availability: {
      type: [String], // Days available: ['Monday', 'Tuesday', ...]
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    consultationFee: {
      type: Number,
      default: 500,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    phone: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
