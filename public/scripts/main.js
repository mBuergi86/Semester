import setLanguageByLocation from "./language.js"; // Importiert die Funktion zur Einstellung der Sprache basierend auf der Benutzerlocation
import init from "./games.js"; // Importiert die Initialisierungsfunktion für Spiele

setLanguageByLocation(); // Setzt die Sprache basierend auf der Benutzerlocation

// Wenn die aktuelle URL "/game.html" ist
if (window.location.pathname === "/game.html") {
  init(); // Initialisiert die Spiele
}

let scrollToTop = document.getElementById("backtop"); // Referenziert das Element mit der ID "backtop"
let menuToggle = document.querySelector(".nav-toggle"); // Referenziert das erste Element mit der Klasse "nav-toggle"
let menuList = document.querySelector(".menu-list"); // Referenziert das erste Element mit der Klasse "menu-list"
let keyboardArrows = document.querySelectorAll(".arrow_down"); // Referenziert alle Elemente mit der Klasse "arrow_down"
let mushroomCursor = document.querySelector(".mushroom"); // Referenziert das Element mit der Klasse "mushroom"
let links = document.querySelectorAll("a"); // Referenziert alle "a"-Elemente

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
    const newImage = document.createElement("img");
    newImage.src = "./src/assets/icons/super_mario_hand.png";
    newImage.alt = "hand";

    mushroomCursor.src = newImage.src;
    mushroomCursor.alt = newImage.alt;
    mushroomCursor.style.animationName = "none";
    mushroomCursor.style.transform = "rotate(30deg)";
  });

  link.addEventListener("mouseleave", function () {
    // Altes Bild-Element erstellen und ersetzen
    const oldImage = document.createElement("img");
    oldImage.src = "./src/assets/icons/super_mario_mushroom.png";
    oldImage.alt = "mushroom";

    // Neues Bild entfernen und altes Bild hinzufügen
    mushroomCursor.src = oldImage.src;
    mushroomCursor.alt = oldImage.alt;
    mushroomCursor.style.animationName = "";
  });
});
