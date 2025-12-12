// main.js
// This file contains global event listeners and shared functions for the EASEIT app.

document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js loaded. UI is unchanged.');
  
    // Global logout function (accessible from any page)
    window.logout = function() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      window.location.href = "/html/signin.html";
    };
  
    // If an element with the id "displayUsername" exists, set its text from localStorage.
    const username = localStorage.getItem("username");
    const displayUsernameElement = document.getElementById("displayUsername");
    if (username && displayUsernameElement) {
      displayUsernameElement.textContent = username;
    }
  
    // You can add additional global functions or event listeners here as needed.
  });
  