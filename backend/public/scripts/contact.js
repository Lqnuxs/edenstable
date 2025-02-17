// contact.js
export function setupContactForm() {
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          message: document.getElementById("message").value,
        };
  
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
  
          const data = await response.json();
          showNotification(data.notification || "Message sent!");
          if (data.clearForm) {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
          }
        } catch (error) {
          console.error("Error submitting contact form:", error);
        }
      });
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
  