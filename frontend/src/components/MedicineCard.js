/**
 * MedicineCard Component
 * Display individual medicine information
 */

import React, { useState } from 'react';
import './MedicineCard.css';

function MedicineCard({ medicine, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= medicine.stock) {
      onAddToCart(medicine, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="medicine-card">
      <div className="medicine-card-header">
        <div className="medicine-icon">💊</div>
        {medicine.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>

      <div className="medicine-card-body">
        <h3 className="medicine-name">{medicine.name}</h3>
        {medicine.genericName && (
          <p className="medicine-generic">{medicine.genericName}</p>
        )}

        <div className="medicine-info">
          <p className="medicine-price">₹{medicine.price}</p>
          <p className="medicine-category">{medicine.category}</p>

          {medicine.dosage && (
            <p>
              <strong>Dosage:</strong> {medicine.dosage}
            </p>
          )}

          {medicine.manufacturer && (
            <p>
              <strong>Manufacturer:</strong> {medicine.manufacturer}
            </p>
          )}

          {medicine.description && (
            <p className="medicine-description">{medicine.description}</p>
          )}

          {medicine.requiresPrescription && (
            <p className="prescription-required">⚠️ Requires Prescription</p>
          )}
        </div>

        <div className="medicine-stock">
          <strong>In Stock:</strong> {medicine.stock} units
        </div>

        {medicine.stock > 0 && (
          <div className="medicine-actions">
            <input
              type="number"
              min="1"
              max={medicine.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="quantity-input"
            />
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={medicine.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineCard;
