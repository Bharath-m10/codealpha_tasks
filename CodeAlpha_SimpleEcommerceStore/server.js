const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let users = [];
let products = [
  { id: 1, name: "Wireless Headphones", price: 2999, description: "High quality noise cancelling wireless headphones with 30h battery life.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, name: "Mechanical Gaming Keyboard", price: 4499, description: "RGB backlit mechanical keyboard with tactile blue switches.", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80" },
  { id: 3, name: "Ergonomic Optical Mouse", price: 1299, description: "Precision wireless mouse with adjustable DPI and silent clicks.", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
  { id: 4, name: "4K Ultra HD Monitor", price: 18999, description: "27-inch IPS panel with 144Hz refresh rate and HDR support.", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" }
];
let orders = [];

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "User already exists" });
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  res.status(201).json({ message: "Registration successful", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
});

// Products Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Order Routes
app.post('/api/orders', (req, res) => {
  const { userId, items, totalAmount } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: "Cart is empty" });
  const newOrder = {
    id: "ORD-" + Date.now(),
    userId: userId || 'Guest',
    items,
    totalAmount,
    date: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json({ message: "Order placed successfully!", order: newOrder });
});

app.listen(PORT, () => {
  console.log(`Task 1: E-commerce Store running at http://localhost:${PORT}`);
});
