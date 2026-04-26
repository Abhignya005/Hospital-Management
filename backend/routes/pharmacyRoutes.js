/**
 * Pharmacy Routes
 * Routes for medicine management and pharmacy operations
 */

const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  updateStock,
} = require('../controllers/pharmacyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/medicines', getMedicines);
router.get('/medicines/:id', getMedicineById);

// Admin only routes
router.post('/medicines', protect, authorize('admin'), addMedicine);
router.put('/medicines/:id', protect, authorize('admin'), updateMedicine);
router.delete('/medicines/:id', protect, authorize('admin'), deleteMedicine);
router.put('/medicines/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
