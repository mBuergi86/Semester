import setLanguageByLocation from "./language.js";
import init from "./games.js";

setLanguageByLocation();
init();

let backtop = document.getElementById("backtop");
let navtoggle = document.querySelector(".nav-toggle");
let menu_list = document.querySelector(".menu-list");
let keyboard_arrows = document.querySelectorAll(".arrow_down");

window.onscroll = function () {
  if (window.pageYOffset > 300) {
    backtop.classList.add("show");
  } else {
    backtop.classList.remove("show");
  }
};

backtop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

navtoggle.addEventListener("click", function () {
  menu_list.classList.toggle("open");
  navtoggle.classList.toggle("open");
  keyboard_arrows.forEach((arrow) => {
    arrow.classList.toggle("open");
  })
});
