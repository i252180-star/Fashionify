// ==================== Product Search Suggestions ====================
const products = [
  "All-Over Printed Shirt", "Button-up Black Shirt", "Basic White Shirt", "Red Checkered Shirt",
  "Running Shoes", "Black M", "White Pink H", "Leather Brown Bag", "Khaki Weekend Cap",
  "Basic Grey Shorts", "Blue H", "Beige Textured Shirt", "Black Bag", "Basic Black"
];

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

if (searchInput && suggestionsBox) {
  searchInput.addEventListener("input", () => {
    const inputVal = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    if (inputVal) {
      const matches = products.filter(p => p.toLowerCase().includes(inputVal));
      matches.forEach(product => {
        const div = document.createElement("div");
        div.textContent = product;
        div.className = "suggestion-item p-2 border-bottom";
        div.addEventListener("click", () => {
          searchInput.value = product;
          suggestionsBox.innerHTML = "";
        });
        suggestionsBox.appendChild(div);
      });
    }
  });
}

// ==================== Cart Logic ====================
function getPrice(productName) {
  const prices = {
    "All-Over Printed Shirt": 4200,
    "Button-up Black Shirt": 4800,
    "Basic White Shirt": 3400,
    "Red Checkered Shirt": 4000,
    "Running Shoes": 6000,
    "Black M": 5800,
    "White Pink H": 6500,
    "Leather Brown Bag": 3500,
    "Khaki Weekend Cap": 1700,
    "Basic Grey Shorts": 2300,
    "Blue H": 4500,
    "Beige Textured Shirt": 3800,
    "Black Bag": 3900,
    "Basic Black": 3000
  };
  return prices[productName] || 2000;
}

function addToCart(productName) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: productName, qty: 1, price: getPrice(productName) });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to cart`);
}

function updateQuantity(name, qty) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(i => i.name === name);
  if (item) item.qty = qty;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  loadPaymentCart();
}

function setupQuantityListeners() {
  const inputs = document.querySelectorAll(".qty-input");
  inputs.forEach(input => {
    input.addEventListener("change", () => {
      const name = input.getAttribute("data-name");
      let qty = parseInt(input.value);
      if (qty < 1) qty = 1;
      updateQuantity(name, qty);
    });
  });
}

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartItems");
  const totalAmount = document.getElementById("totalAmount");

  if (!cartContainer || !totalAmount) return;

  let total = 0;
  cartContainer.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item row align-items-center mb-4";

    row.innerHTML = `
      <div class="col-md-3">
        <img src="images/sample.jpg" class="img-fluid rounded" style="height: 200px; object-fit: cover;">
      </div>
      <div class="col-md-9">
        <p><strong>Product:</strong> ${item.name}</p>
        <p><strong>Price per Item:</strong> ₨${item.price.toLocaleString()}</p>
        <div class="d-flex align-items-center">
          <label class="me-2"><strong>Quantity:</strong></label>
          <input type="number" class="form-control w-auto qty-input" value="${item.qty}" min="1" data-name="${item.name}">
        </div>
      </div>
    `;
    cartContainer.appendChild(row);
    total += item.qty * item.price;
  });

  totalAmount.textContent = `₨${total.toLocaleString()}`;
  setupQuantityListeners();
}

// ==================== PAYMENT CART ====================
function loadPaymentCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalBox = document.getElementById("paymentTotal");
  if (!totalBox) return;

  let total = 0;
  cart.forEach(item => total += item.price * item.qty);
  totalBox.textContent = `₨${total.toLocaleString()}`;
}

// ==================== On Page Load ====================
window.addEventListener("DOMContentLoaded", () => {
  // Load Cart
  if (document.getElementById("cartItems")) {
    loadCartItems();
  }

  // Payment total
  loadPaymentCart();

  // Sticky Footer
  const footer = document.querySelector("footer");
  if (footer) {
    const height = Math.max(document.body.scrollHeight, document.documentElement.clientHeight);
    if (height <= window.innerHeight) {
      footer.style.position = "fixed";
      footer.style.bottom = "0";
      footer.style.left = "0";
      footer.style.width = "100%";
    }
  }

  // Toggle Card Payment Form
  const cardRadio = document.getElementById('card');
  const codRadio = document.getElementById('cod');
  const cardDetails = document.getElementById('cardDetails');
  if (cardRadio && codRadio && cardDetails) {
    const toggleCardForm = () => {
      cardDetails.style.display = cardRadio.checked ? "block" : "none";
    };
    cardRadio.addEventListener("change", toggleCardForm);
    codRadio.addEventListener("change", toggleCardForm);
    toggleCardForm();
  }
});

// ==================== Pages Redirection ====================
function placeOrder(event) {
  event.preventDefault();
  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "home.html";
}

function redirectToHome(event) {
  event.preventDefault();
  alert("Login successful!");
  window.location.href = "home.html";
}

// ==================== Category Page Switching ====================
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section-products");
  sections.forEach(section => {
    section.style.display = "none";
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.style.display = "block";
  }
}
