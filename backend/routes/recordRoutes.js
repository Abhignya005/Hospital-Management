/**
 * Health Record Routes
 */

const express = require('express');
const router = express.Router();
const { 
  getUserRecords, 
  getRecord, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get all records (with optional type filter)
router.get('/', getUserRecords);

// Get single record
router.get('/:id', getRecord);

// Create new record
router.post('/', createRecord);

// Update record
router.put('/:id', updateRecord);

// Delete record
router.delete('/:id', deleteRecord);

module.exports = router;
