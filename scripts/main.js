import setLanguageByLocation from "./language.js";
import init from "./games.js";

setLanguageByLocation();
init();

var backtop = document.getElementById("backtop");

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