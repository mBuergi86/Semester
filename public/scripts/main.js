import setLanguageByLocation from "./language.js"; // Importiert die Funktion zur Einstellung der Sprache basierend auf der Benutzerlocation
import init from "./games.js"; // Importiert die Initialisierungsfunktion für Spiele
import initializeContactForm from "./contact.js"; // Importiert die Initialisierungsfunktion für das Kontaktformular
import initializeForum from "./forum.js"; // Importiert die Initialisierungsfunktion für das Forum

setLanguageByLocation(); // Setzt die Sprache basierend auf der Benutzerlocation

// Wenn die aktuelle URL "/game.html" ist
if (window.location.pathname === "/game.html") {
  init(); // Initialisiert die Spiele
}

// Wenn die aktuelle URL "/contact.html" ist
if (window.location.pathname === "/contact.html") {
  document.addEventListener("DOMContentLoaded", function () {
    initializeContactForm(); // Initialisiert das Kontaktformular
  });
}

// Wenn die aktuelle URL "/forum.html" ist
if (window.location.pathname === "/forum.html") {
  document.addEventListener("DOMContentLoaded", function () {
    initializeForum(); // Initialisiert das Forum
  });
}

let scrollToTop = document.getElementById("backtop"); // Referenziert das Element mit der ID "backtop"
let menuToggle = document.querySelector(".nav-toggle"); // Referenziert das erste Element mit der Klasse "nav-toggle"
let menuList = document.querySelector(".menu-list"); // Referenziert das erste Element mit der Klasse "menu-list"
let keyboardArrows = document.querySelectorAll(".arrow_down"); // Referenziert alle Elemente mit der Klasse "arrow_down"
let mushroomCursor = document.querySelector(".mushroom"); // Referenziert das Element mit der Klasse "mushroom"
let links = document.querySelectorAll("a"); // Referenziert alle "a"-Elemente
let button = document.querySelectorAll("button"); // Referenziert alle "button"-Elemente

window.onscroll = function () {
  // Funktion, die beim Scrollen ausgelöst wird
  if (window.pageYOffset > 300) {
    // Wenn die Seite mehr als 300 Pixel gescrollt wurde
    scrollToTop.classList.add("show"); // Fügt die Klasse "show" zum "backtop"-Element hinzu
  } else {
    // Wenn die Seite weniger als 300 Pixel gescrollt wurde
    scrollToTop.classList.remove("show"); // Entfernt die Klasse "show" vom "backtop"-Element
  }
};

scrollToTop.addEventListener("click", function () {
  // Funktion, die beim Klicken auf das "backtop"-Element ausgelöst wird
  window.scrollTo({
    // Scrollt die Seite
    top: 0, // Nach oben
    behavior: "smooth", // Mit sanftem Scrollen
  });
});

menuToggle.addEventListener("click", function () {
  // Funktion, die beim Klicken auf das "navtoggle"-Element ausgelöst wird
  menuList.classList.toggle("open"); // Schaltet die Klasse "open" beim "menu_list"-Element um
  menuToggle.classList.toggle("open"); // Schaltet die Klasse "open" beim "navtoggle"-Element um
  keyboardArrows.forEach((arrow) => {
    // Für jedes "arrow_down"-Element
    arrow.classList.toggle("open"); // Schaltet die Klasse "open" um
  });
});

window.addEventListener("mousemove", function (e) {
  // Funktion, die beim Bewegen des Mauszeigers ausgeführt wird
  const mouseY = e.clientY; // Holt die Y-Position des Mauszeigers
  const mouseX = e.clientX; // Holt die X-Position des Mauszeigers

  const offsetX = -10; // Verschiebt das "mushroom"-Element um 10 Pixel nach rechts
  const offsetY = -5; // Verschiebt das "mushroom"-Element um 10 Pixel nach unten

  // Bewegt das "mushroom"-Element zur Position des Mauszeigers
  mushroomCursor.style.top = mouseY + offsetY + "px";
  mushroomCursor.style.left = mouseX + offsetX + "px";
});

// Für jedes "a"-Element Event-Listener hinzufügen
links.forEach((link) => {
  link.addEventListener("mouseenter", function () {
    // Neues Bild setzen
    const newImage = document.createElement("img"); // Neues Bild-Element erstellen
    newImage.src = "./src/assets/icons/super_mario_hand.png"; // Bild-Source setzen
    newImage.alt = "hand"; // Bild-Alt setzen

    // Altes Bild entfernen und neues Bild hinzufügen
    mushroomCursor.src = newImage.src; // Altes Bild-Source ersetzen
    mushroomCursor.alt = newImage.alt; // Altes Bild-Alt ersetzen
    mushroomCursor.style.animationName = "none"; // Animation deaktivieren
    mushroomCursor.style.transform = "rotate(30deg)"; // Bewegung um 30° drehen
  });

  link.addEventListener("mouseleave", function () {
    // Altes Bild-Element erstellen und ersetzen
    const oldImage = document.createElement("img"); // Altes Bild-Element erstellen
    oldImage.src = "./src/assets/icons/super_mario_mushroom.png"; // Bild-Source setzen
    oldImage.alt = "mushroom"; // Bild-Alt setzen

    // Neues Bild entfernen und altes Bild hinzufügen
    mushroomCursor.src = oldImage.src; // Altes Bild-Source ersetzen
    mushroomCursor.alt = oldImage.alt; // Altes Bild-Alt ersetzen
    mushroomCursor.style.animationName = ""; // Animation ausblenden
  });
});

// Für jedes "button"-Element Event-Listener hinzufügen
button.forEach((link) => {
  link.addEventListener("mouseenter", function () {
    // Neues Bild setzen
    const newImage = document.createElement("img"); // Neues Bild-Element erstellen
    newImage.src = "./src/assets/icons/super_mario_hand.png"; // Bild-Source setzen
    newImage.alt = "hand"; // Bild-Alt setzen

    // Altes Bild entfernen und neues Bild hinzufügen
    mushroomCursor.src = newImage.src; // Altes Bild-Source ersetzen
    mushroomCursor.alt = newImage.alt; // Altes Bild-Alt ersetzen
    mushroomCursor.style.animationName = "none"; // Animation deaktivieren
    mushroomCursor.style.transform = "rotate(-30deg)"; // Bewegung um 30° drehen
  });

  link.addEventListener("mouseleave", function () {
    // Altes Bild-Element erstellen und ersetzen
    const oldImage = document.createElement("img"); // Altes Bild-Element erstellen
    oldImage.src = "./src/assets/icons/super_mario_mushroom.png"; // Bild-Source setzen
    oldImage.alt = "mushroom"; // Bild-Alt setzen

    // Neues Bild entfernen und altes Bild hinzufügen
    mushroomCursor.src = oldImage.src; // Altes Bild-Source ersetzen
    mushroomCursor.alt = oldImage.alt; // Altes Bild-Alt ersetzen
    mushroomCursor.style.animationName = ""; // Animation ausblenden
  });
});

// Funktion, die beim Klicken auf das "mushroom"-Element ausgelöst wird
window.addEventListener("mouseup", function (e) {
  // Wenn das "mushroom"-Element geklickt wird
  // Neues Span-Element erstellen
  const newSpan = document.createElement("span"); // Neues Span-Element erstellen
  newSpan.style.display = "block"; // Span-Element anzeigen
  newSpan.style.position = "fixed"; // Span-Element fixieren
  newSpan.style.width = "2rem"; // Span-Element mit Breite von 2rem
  newSpan.style.height = "2rem"; // Span-Element mit Hohe von 2rem
  newSpan.style.backgroundColor = "white"; // Span-Element mit Hintergrundfarbe von weiss
  newSpan.style.borderRadius = "50%"; // Span-Element mit Radius von 50%
  newSpan.style.zIndex = "9999"; // Span-Element mit Index von 9999
  newSpan.style.animationName = "mushroom-clicked"; // Animation benennen
  newSpan.style.animationDuration = "0.2s"; // Animationdauer festlegen
  newSpan.style.animationTimingFunction = "ease-in-out"; // Animation-Timing-Funktion festlegen
  newSpan.style.left = e.clientX - 16 + "px"; // Span-Element an der X-Position des Mauszeigers setzen
  newSpan.style.top = e.clientY - 11 + "px"; // Span-Element an der Y-Position des Mauszeigers setzen

  // Span-Element hinzufügen
  document.body.appendChild(newSpan); // Span-Element zum Body hinzufügen

  // Span-Element nach der Animation entfernen
  newSpan.addEventListener("animationend", function () {
    newSpan.remove();
  });
});
