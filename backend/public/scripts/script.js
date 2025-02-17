import { setupNavigation } from "./navigation.js";
import { setupCart } from "./cart.js";
import { setupContactForm } from "./contact.js";
import { setupCarousel } from "./carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupCart();
  setupContactForm();
  setupCarousel();
});
