const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8082;

// Define directories
const BASE_DIR = __dirname;
const FRONTEND_DIR = path.join(BASE_DIR, "../frontend");
const PUBLIC_DIR = path.join(BASE_DIR, "public");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// Serve HTML pages
app.get("/", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "index.html")));
app.get("/cart.html", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "cart.html")));
app.get("/menu.html", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "menu.html")));
app.get("/contact.html", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "contact.html")));
app.get("/mission.html", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "mission.html")));
app.get("/references.html", (req, res) => res.sendFile(path.join(FRONTEND_DIR, "references.html")));

// ---------------- In-Memory Cart API ----------------
let cart = [];

app.post("/api/cart/add", (req, res) => {
  const { item_id, name, price, quantity } = req.body;
  let existingItem = cart.find(item => item.item_id === item_id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ item_id, name, price, quantity });
  }

  res.json({ status: "success", message: "Item added to cart!", cart });
});

app.get("/api/cart", (req, res) => {
  res.json({ cart });
});

app.post("/api/cart/remove", (req, res) => {
  const { item_id } = req.body;
  cart = cart
    .map(item => {
      if (item.item_id === item_id) {
        item.quantity -= 1;
      }
      return item;
    })
    .filter(item => item.quantity > 0);
  res.json({ status: "success", message: "Item removed from cart!", cart });
});

app.post("/api/cart/clear", (req, res) => {
  cart = [];
  res.json({ status: "success", message: "Cart cleared!", cart });
});

// ---------------- Contact Form API ----------------
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(`New contact message from ${name} (${email}): ${message}`);

  res.json({
    status: "success",
    message: "Thank you for contacting us. We'll be in touch soon.",
    notification: "Message sent successfully!",
    clearForm: true
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
