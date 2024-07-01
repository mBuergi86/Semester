function initializeContactForm() {
  const form = document.getElementById("contact-form");
  const loadingOverlay = document.getElementById("loading-overlay");
  const body = document.body;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Hinzufügen der Klasse "hidden" zum Verstecken des Formulars und Anzeigen des Lade-Overlays
      loadingOverlay.classList.remove("hidden");
      body.classList.add("disabled");

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

        loadingOverlay.classList.add("hidden");
        body.classList.remove("disabled");

        if (response.ok) {
          const result = await response.json();
          form.reset();
          window.location.href = "/thanks.html";
        } else {
          const errorData = await response.json();
          alert(
            errorData.message ||
              "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.",
          );
        }
      } catch (error) {
        console.error("Error:", error);

        loadingOverlay.classList.add("hidden");
        body.classList.remove("disabled");

        alert(`Fehler beim Senden der Nachricht: ${error.message}`);
      }
    });
  } else {
    console.error("Contact form not found in the DOM");
  }
}

export default initializeContactForm;
