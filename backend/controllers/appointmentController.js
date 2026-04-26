/**
 * Appointment Controller
 * Handles appointment booking and management
 */

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

/**
 * @route /api/appointments
 * @method GET
 * @description Get all appointments (Admin) or user's appointments
 */
exports.getAppointments = async (req, res) => {
  try {
    let appointments;

    // If user is admin, get all appointments
    if (req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('userId', 'name email phone')
        .populate('doctorId', 'name specialization');
    } else {
      // Otherwise get only user's appointments
      appointments = await Appointment.find({ userId: req.user.id })
        .populate('userId', 'name email phone')
        .populate('doctorId', 'name specialization');
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/appointments
 * @method POST
 * @description Book a new appointment
 */
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // Validation
    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'pending',
    });

    // Populate doctor and user info
    await appointment.populate('userId', 'name email phone');
    await appointment.populate('doctorId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/appointments/:id
 * @method GET
 * @description Get appointment by ID
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/appointments/:id
 * @method PUT
 * @description Update appointment status (Admin/Doctor only)
 */
exports.updateAppointment = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();
    await appointment.populate('userId', 'name email phone');
    await appointment.populate('doctorId', 'name specialization');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/appointments/:id
 * @method DELETE
 * @description Cancel appointment
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
