// this js file contains functions for the toogle classes and other responsive functions
// code is refactored to other fetch.js file to avoid redundancy and to make it easier to maintain
document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".nav-link");
  const cards = document.querySelectorAll(".toggle-cards");

  // Add active class to clicked sidebar link
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      sidebarLinks.forEach(function (otherLink) {
        otherLink.classList.remove("active");
      });
      link.classList.add("active");
    });
  });
});
