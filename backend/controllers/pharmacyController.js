/**
 * Pharmacy Controller
 * Handles medicine management and pharmacy operations
 */

const Medicine = require('../models/Medicine');

/**
 * @route /api/pharmacy/medicines
 * @method GET
 * @description Get all medicines
 */
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/pharmacy/medicines/:id
 * @method GET
 * @description Get a single medicine by ID
 */
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/pharmacy/medicines
 * @method POST
 * @description Add a new medicine (Admin only)
 */
exports.addMedicine = async (req, res) => {
  try {
    const { name, price, stock, category, description, manufacturer, dosage } = req.body;

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields',
      });
    }

    const medicine = await Medicine.create({
      name,
      price,
      stock,
      category,
      description,
      manufacturer,
      dosage,
    });

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/pharmacy/medicines/:id
 * @method PUT
 * @description Update medicine details (Admin only)
 */
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/pharmacy/medicines/:id
 * @method DELETE
 * @description Delete a medicine (Admin only)
 */
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route /api/pharmacy/medicines/:id/stock
 * @method PUT
 * @description Update medicine stock
 */
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity',
      });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    medicine.stock = quantity;
    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
