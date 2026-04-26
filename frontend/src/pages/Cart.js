/**
 * Cart Page
 * Display and manage shopping cart for medicines
 */

import React, { useEffect, useState } from 'react';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleUpdateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(medicineId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item._id === medicineId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (medicineId) => {
    const updatedCart = cartItems.filter((item) => item._id !== medicineId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear the entire cart?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon! Total: ₹' + totalPrice);
    // In a real application, you would integrate with a payment gateway here
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review and manage your medicines</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-container">
          <div className="cart-items-section">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="medicine-info">
                        <p className="medicine-name">{item.name}</p>
                        {item.dosage && (
                          <p className="medicine-dosage">{item.dosage}</p>
                        )}
                      </div>
                    </td>
                    <td>₹{item.price}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item._id, parseInt(e.target.value))
                        }
                        className="quantity-input"
                      />
                    </td>
                    <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹50</span>
            </div>

            <div className="summary-row">
              <span>Discount:</span>
              <span className="discount">-₹0</span>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>₹{(totalPrice + 50).toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="cart-info">
              <p>✓ Free delivery on orders above ₹500</p>
              <p>✓ Fastest delivery in your area</p>
              <p>✓ Quality medicines guaranteed</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Start shopping for medicines now</p>
          <a href="/pharmacy" className="continue-shopping-btn">
            Continue Shopping
          </a>
        </div>
      )}
    </div>
  );
}

export default Cart;
