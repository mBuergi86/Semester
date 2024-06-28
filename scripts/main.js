import setLanguageByLocation from "./language.js"; // Importiert die Funktion zur Einstellung der Sprache basierend auf der Benutzerlocation
import init from "./games.js"; // Importiert die Initialisierungsfunktion für Spiele

setLanguageByLocation(); // Setzt die Sprache basierend auf der Benutzerlocation

// Wenn die aktuelle URL "/game.html" ist
if (window.location.pathname === "/game.html") {
  init(); // Initialisiert die Spiele
}

let backtop = document.getElementById("backtop"); // Referenziert das Element mit der ID "backtop"
let navtoggle = document.querySelector(".nav-toggle"); // Referenziert das erste Element mit der Klasse "nav-toggle"
let menu_list = document.querySelector(".menu-list"); // Referenziert das erste Element mit der Klasse "menu-list"
let keyboard_arrows = document.querySelectorAll(".arrow_down"); // Referenziert alle Elemente mit der Klasse "arrow_down"

window.onscroll = function () {
  // Funktion, die beim Scrollen ausgelöst wird
  if (window.pageYOffset > 300) {
    // Wenn die Seite mehr als 300 Pixel gescrollt wurde
    backtop.classList.add("show"); // Fügt die Klasse "show" zum "backtop"-Element hinzu
  } else {
    // Wenn die Seite weniger als 300 Pixel gescrollt wurde
    backtop.classList.remove("show"); // Entfernt die Klasse "show" vom "backtop"-Element
  }
};

backtop.addEventListener("click", function () {
  // Funktion, die beim Klicken auf das "backtop"-Element ausgelöst wird
  window.scrollTo({
    // Scrollt die Seite
    top: 0, // Nach oben
    behavior: "smooth", // Mit sanftem Scrollen
  });
});

navtoggle.addEventListener("click", function () {
  // Funktion, die beim Klicken auf das "navtoggle"-Element ausgelöst wird
  menu_list.classList.toggle("open"); // Schaltet die Klasse "open" beim "menu_list"-Element um
  navtoggle.classList.toggle("open"); // Schaltet die Klasse "open" beim "navtoggle"-Element um
  keyboard_arrows.forEach((arrow) => {
    // Für jedes "arrow_down"-Element
    arrow.classList.toggle("open"); // Schaltet die Klasse "open" um
  });
});
