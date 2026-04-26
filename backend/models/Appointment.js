/**
 * Appointment Model
 * Stores appointment bookings
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please provide a doctor ID'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide an appointment date'],
    },
    appointmentTime: {
      type: String, // Format: "10:00 AM"
      required: [true, 'Please provide an appointment time'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide the reason for appointment'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
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

module.exports = mongoose.model('Appointment', appointmentSchema);
