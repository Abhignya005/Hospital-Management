/**
 * Pharmacy Page
 * Display medicines for purchase
 */

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MedicineCard from '../components/MedicineCard';
import './Pharmacy.css';

function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Pain Relief', 'Cold & Flu', 'Digestive', 'Vitamins', 'Antibiotics', 'Others'];

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [selectedCategory, searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/pharmacy/medicines');
      if (response.data.success) {
        setMedicines(response.data.medicines);
      }
    } catch (err) {
      setError('Failed to fetch medicines');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((med) => med.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (med) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMedicines(filtered);
  };

  const handleAddToCart = (medicine, quantity) => {
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if medicine already in cart
    const existingItem = cart.find((item) => item._id === medicine._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...medicine, quantity });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${medicine.name} added to cart!`);
  };

  return (
    <div className="pharmacy-page">
      <div className="pharmacy-header">
        <h1>Hospital Pharmacy</h1>
        <p>Order medicines online with fast delivery</p>
      </div>

      <div className="pharmacy-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          <h3>Category:</h3>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Loading medicines...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredMedicines.length > 0 ? (
        <>
          <p className="results-count">
            Found {filteredMedicines.length} medicine(s)
          </p>
          <div className="medicines-grid">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine._id}
                medicine={medicine}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="no-medicines">
          No medicines found. Try a different search or category.
        </p>
      )}
    </div>
  );
}

export default Pharmacy;
