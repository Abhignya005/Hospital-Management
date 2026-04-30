/**
 * Health Record Model
 * Stores patient health records (lab results, prescriptions, radiology, etc.)
 */

const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    type: {
      type: String,
      enum: ['lab', 'prescription', 'radiology', 'cardiac', 'other'],
      required: [true, 'Please specify record type'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '', // In production, store S3 URLs or file paths
    },
    fileName: {
      type: String,
      default: '',
    },
    doctorName: {
      type: String,
      default: '', // Name of the doctor who issued this record
    },
    visitDate: {
      type: Date,
      default: new Date(),
    },
    testDate: {
      type: Date,
      default: null,
    },
    results: {
      type: String,
      default: '', // Summary or detailed results
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'reviewed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
