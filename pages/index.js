import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatInterface from "../components/ChatInterface";
import { FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("https://order-backend-w7dt.onrender.com/api/items");
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const addToCart = async (item) => {
    await axios.post("https://order-backend-w7dt.onrender.com/api/items/cart", item);
    const res = await axios.get("https://order-backend-w7dt.onrender.com/api/items/cart");
    setCart(res.data);
  };

  const removeFromCart = async (sku) => {
    await axios.delete(`https://order-backend-w7dt.onrender.com/api/items/cart/${sku}`);
    const res = await axios.get("https://order-backend-w7dt.onrender.com/api/items/cart");
    setCart(res.data);
  };

  const updateCartItemQuantity = async (sku, action) => {
    await axios.put(`https://order-backend-w7dt.onrender.com/api/items/cart/${sku}`, { action });
    const res = await axios.get("https://order-backend-w7dt.onrender.com/api/items/cart");
    setCart(res.data);
  };

  // Calculate the total price of the items in the cart
  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    ).toFixed(2); // rounding to 2 decimal places
  };

  // Filter items based on name and sku
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Shopping App</h1>
        <div className="cart-container" onClick={() => setShowCart(!showCart)}>
          <FaShoppingCart size={30} />
          <span className="cart-count">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </div>
      </header>

      <main className="app-main">
        <section className="items-section">
          <h2>Browse Items</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search items or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="items-list">
            {filteredItems.map((item) => (
              <div key={item.sku} className="item-card">
                <p className="item-name">{item.name}</p>
                <p className="item-price">
                  ${item.price} (SKU: {item.sku})
                </p>
                <div className="item-actions">
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                  <span className="item-count">
                    (
                    {cart.find((cartItem) => cartItem.sku === item.sku)
                      ?.quantity || 0}
                    )
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showCart && (
        <div className="cart-popup">
          <div className="cart-popup-content">
            <h2>Your Cart</h2>
            <div className="cart-list">
              {cart.map((item) => (
                <div key={item.sku} className="cart-item">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">
                    ${item.price} (SKU: {item.sku})
                  </p>
                  <div className="cart-item-actions">
                    <button
                      className="quantity-btn"
                      onClick={() => updateCartItemQuantity(item.sku, "decrease")}
                    >
                      -
                    </button>
                    <span className="item-quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateCartItemQuantity(item.sku, "increase")}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.sku)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="total-amount">
              <p>Total Amount: ${calculateTotal()}</p>
            </div>
            <button className="close-cart-btn" onClick={() => setShowCart(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <ChatInterface />
    </div>
  );
};

export default Home;