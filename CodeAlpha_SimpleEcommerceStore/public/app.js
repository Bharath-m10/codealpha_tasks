let currentUser = null;
let cart = [];
let isLoginMode = true;

window.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const grid = document.getElementById('productGrid');
  grid.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-price">₹${p.price.toLocaleString()}</div>
        <div class="card-actions">
          <button onclick="viewDetails(${p.id})">Details</button>
          <button style="background:#2563eb; color:white; border:none;" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function viewDetails(id) {
  const res = await fetch(`/api/products/${id}`);
  const p = await res.json();
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <img src="${p.image}" style="width:100%; height:200px; object-fit:cover; border-radius:6px; margin-bottom:12px;">
    <h3>${p.name}</h3>
    <h4 style="color:#16a34a; margin: 8px 0;">₹${p.price.toLocaleString()}</h4>
    <p style="color:#64748b; font-size:14px; line-height:1.5;">${p.description}</p>
    <button class="primary-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price}); closeDetailsModal();">Add To Cart</button>
  `;
  document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal() {
  document.getElementById('detailsModal').style.display = 'none';
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCartUI();
  alert(`Added ${name} to cart!`);
}

function updateCartUI() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById('cartCount').innerText = count;
  const list = document.getElementById('cartItemsList');
  if (cart.length === 0) {
    list.innerHTML = '<p style="color:#64748b; padding:12px 0;">Your cart is empty.</p>';
  } else {
    list.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>${item.name} x ${item.qty}</span>
        <span>₹${(item.price * item.qty).toLocaleString()}</span>
      </div>
    `).join('');
  }
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  document.getElementById('cartTotal').innerText = `Total: ₹${total.toLocaleString()}`;
}

function toggleCartModal() {
  const m = document.getElementById('cartModal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function toggleAuthModal() {
  const m = document.getElementById('authModal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function switchAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('authTitle').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('submitAuthBtn').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('nameGroup').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('switchText').innerText = isLoginMode ? "Don't have an account? Register" : "Already have an account? Login";
}

async function handleAuth() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const name = document.getElementById('authName').value;

  const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
  const payload = isLoginMode ? { email, password } : { name, email, password };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (res.ok) {
    currentUser = data.user;
    document.getElementById('userStatus').innerText = `Hi, ${currentUser.name || currentUser.email}`;
    toggleAuthModal();
    alert(`Success: ${data.message}`);
  } else {
    alert(data.error || 'Authentication failed');
  }
}

async function checkout() {
  if (cart.length === 0) return alert('Your cart is empty!');
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser ? currentUser.id : 'Guest',
      items: cart,
      totalAmount: total
    })
  });
  const data = await res.json();
  if (res.ok) {
    alert(`Order Placed! Order ID: ${data.order.id}`);
    cart = [];
    updateCartUI();
    toggleCartModal();
  } else {
    alert(data.error || 'Failed to place order');
  }
}
