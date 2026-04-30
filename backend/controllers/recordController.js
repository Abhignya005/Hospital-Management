/**
 * Health Record Controller
 * Handles health record operations
 */

const HealthRecord = require('../models/HealthRecord');

// Get all records for a user
exports.getUserRecords = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { type } = req.query; // Optional filter by type

    let query = { userId };
    if (type && type !== 'all') {
      query.type = type;
    }

    const records = await HealthRecord.find(query).sort({ visitDate: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch records',
    });
  }
};

// Get a single record
exports.getRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const record = await HealthRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check if record belongs to user
    if (record.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this record',
      });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch record',
    });
  }
};

// Create a new record
exports.createRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, title, description, doctorName, visitDate, testDate, results } = req.body;

    // Validate required fields
    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'Type and title are required',
      });
    }

    const record = await HealthRecord.create({
      userId,
      type,
      title,
      description,
      doctorName,
      visitDate: visitDate || new Date(),
      testDate: testDate || null,
      results,
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create record',
    });
  }
};

// Update a record
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, doctorName, visitDate, testDate, results, status } = req.body;

    const record = await HealthRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check authorization
    if (record.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this record',
      });
    }

    // Update fields
    if (title) record.title = title;
    if (description) record.description = description;
    if (doctorName) record.doctorName = doctorName;
    if (visitDate) record.visitDate = visitDate;
    if (testDate) record.testDate = testDate;
    if (results) record.results = results;
    if (status) record.status = status;

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update record',
    });
  }
};

// Delete a record
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const record = await HealthRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check authorization
    if (record.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this record',
      });
    }

    await HealthRecord.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete record',
    });
  }
};
