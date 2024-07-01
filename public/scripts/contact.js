function initializeContactForm() {
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const formDataObject = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message || "Nachricht erfolgreich gesendet!");
          form.reset();
        } else {
          const errorData = await response.json();
          alert(
            errorData.message ||
              "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.",
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`Fehler beim Senden der Nachricht: ${error.message}`);
      }
    });
  } else {
    console.error("Contact form not found in the DOM");
  }
}

export default initializeContactForm;
