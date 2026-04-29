/**
 * Appointment Routes
 * Routes for appointment booking and management
 */

const express = require('express');
const router = express.Router();
const {
  getAppointments,
  bookAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes (user must be logged in)
router.get('/', protect, getAppointments);
router.post('/', protect, bookAppointment);
router.get('/:id', protect, getAppointmentById);

// Admin/doctor routes
router.put('/:id', protect, authorize('admin', 'doctor'), updateAppointment);
router.delete('/:id', protect, authorize('admin'), cancelAppointment);

module.exports = router;
