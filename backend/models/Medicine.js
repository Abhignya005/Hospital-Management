/**
 * Medicine Model
 * Stores medicine information for pharmacy
 */

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a medicine name'],
      trim: true,
    },
    genericName: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    manufacturer: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Pain Relief', 'Cold & Flu', 'Digestive', 'Vitamins', 'Antibiotics', 'Others'],
      default: 'Others',
    },
    dosage: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
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

module.exports = mongoose.model('Medicine', medicineSchema);
