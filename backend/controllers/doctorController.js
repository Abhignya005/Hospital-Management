/**
 * Doctor Controller
 * Handles doctor-related operations
 */

const Doctor = require('../models/Doctor');

/**
 * @route /api/doctors
 * @method GET
 * @description Get all doctors
 */
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/doctors/:id
 * @method GET
 * @description Get a single doctor by ID
 */
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/doctors
 * @method POST
 * @description Create a new doctor (Admin only)
 */
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, specialization, qualifications, experience, consultationFee, phone } = req.body;

    // Validation
    if (!name || !email || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields',
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      specialization,
      qualifications,
      experience,
      consultationFee,
      phone,
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/doctors/:id
 * @method PUT
 * @description Update a doctor (Admin only)
 */
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/doctors/:id
 * @method DELETE
 * @description Delete a doctor (Admin only)
 */
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
