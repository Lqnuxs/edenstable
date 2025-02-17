// cart.js
export function setupCart() {
    // Attach event listeners for Add to Cart buttons
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = {
          item_id: parseInt(button.getAttribute("data-item-id")) || 1,
          name: button.getAttribute("data-item-name") || "Sample Dish",
          price: parseFloat(button.getAttribute("data-item-price")) || 10.99,
          quantity: 1,
        };
        addItemToCart(item);
      });
    });
  
    // Attach event listeners for Remove buttons
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-item-id");
        if (itemId) {
          removeItemFromCart(itemId);
        } else {
          console.warn("No data-item-id attribute found on remove button.");
        }
      });
    });
  
    // Load the cart on page load
    loadCart();
  }
  
  async function loadCart() {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      updateCartUI(data.cart);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }
  
  async function addItemToCart(item) {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      console.log("Updated cart:", data.cart);
      updateCartUI(data.cart);
      showNotification("Added to Cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }
  
  async function removeItemFromCart(itemId) {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await response.json();
      updateCartUI(data.cart);
      showNotification(data.message);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }
  
  function updateCartUI(cart) {
    const cartContainer = document.querySelector("#cart-items");
    if (!cartContainer) {
      console.error("Cart container not found in HTML.");
      return;
    }
  
    // Clear previous items
    cartContainer.innerHTML = "";
  
    if (cart.length === 0) {
      cartContainer.innerHTML = `<tr>
        <td colspan="5" style="text-align:center; padding: 20px;">Your cart is empty.</td>
      </tr>`;
      document.getElementById("subtotal").innerHTML = `<strong>$0.00</strong>`;
      document.getElementById("tax").innerHTML = `<strong>$0.00</strong>`;
      document.getElementById("total-cost").innerHTML = `<strong>$0.00</strong>`;
      return;
    }
  
    let subtotal = 0;
    cart.forEach((item) => {
      const itemSubtotal = (item.price * item.quantity).toFixed(2);
      subtotal += parseFloat(itemSubtotal);
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="" class="product-column">
          <div class="product-info">
            <span class="cart-item-name">${item.name}</span>
          </div>
        </td>
        <td data-label="Price:">$${item.price.toFixed(2)}</td>
        <td data-label="Quantity:" class="quantity-cell">
          <button class="decrease-btn" data-item-id="${item.item_id}">↓</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="increase-btn" data-item-id="${item.item_id}">↑</button>
        </td>
        <td data-label="Subtotal:">$${itemSubtotal}</td>
        <td data-label="" class="actions-cell">
          <button class="remove-item" data-item-id="${item.item_id}">
            <img src="/assets/close.png" alt="Remove" />
          </button>
        </td>
      `;
      cartContainer.appendChild(row);
  
      row.querySelector(".increase-btn").addEventListener("click", () => {
        addItemToCart({
          item_id: item.item_id,
          name: item.name,
          price: item.price,
          quantity: 1,
        });
      });
  
      row.querySelector(".decrease-btn").addEventListener("click", () => {
        removeItemFromCart(item.item_id);
      });
  
      const removeBtn = row.querySelector(".remove-item");
      removeBtn.addEventListener("click", () => {
        fullRemoveItemFromCart(item.item_id);
        showNotification("Removed from cart");
      });
    });
  
    const taxRate = 0.0625;
    const tax = (subtotal * taxRate).toFixed(2);
    const total = (subtotal + parseFloat(tax)).toFixed(2);
  
    document.getElementById("subtotal").innerHTML = `<strong>$${subtotal.toFixed(2)}</strong>`;
    document.getElementById("tax").innerHTML = `<strong>$${tax}</strong>`;
    document.getElementById("total-cost").innerHTML = `<strong>$${total}</strong>`;
  }
  
  async function fullRemoveItemFromCart(itemId) {
    try {
      let removed = false;
      while (!removed) {
        const response = await fetch("/api/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_id: itemId }),
        });
        const data = await response.json();
        updateCartUI(data.cart);
        if (!data.cart.some((it) => it.item_id == itemId)) {
          removed = true;
        }
      }
    } catch (error) {
      console.error("Error fully removing item from cart:", error);
    }
  }
  
  function showNotification(message) {
    const notif = document.createElement("div");
    notif.textContent = message;
    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.right = "20px";
    notif.style.backgroundColor = "#609011";
    notif.style.color = "#fff";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "5px";
    notif.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    notif.style.zIndex = "1000";
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.remove();
    }, 2000);
  }
  