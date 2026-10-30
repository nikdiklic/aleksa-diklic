const $ = (s) => document.querySelector(s);

let isMenuShown = false;
const menu = $("#mobile-menu");
const menuBackdrop = $(".menu-backdrop");
const hamburger = $("#hamburger");

const setMenuShown = (isShown) => {
  isMenuShown = isShown;
  menu.style.display = isShown ? "flex" : "none";
  menuBackdrop.hidden = !isShown;
  hamburger.setAttribute("aria-expanded", String(isShown));
  hamburger.setAttribute(
    "aria-label",
    isShown ? "Close navigation" : "Open navigation",
  );
};

hamburger.addEventListener("click", () => setMenuShown(!isMenuShown));
menuBackdrop.addEventListener("click", () => setMenuShown(false));
