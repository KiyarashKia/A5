/********************************************************************************
*  WEB322 – Assignment 03 - Custom JS file
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Kiarash Kia Student ID: 108688235 Date: 02/21/2024
*
********************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-controller');
    
    themeToggle.addEventListener('change', () => {
      if(themeToggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dim');
      } else {
        document.documentElement.setAttribute('data-theme', 'emerald');
      }
    });
  
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.checked = currentTheme === 'dim';
  });
  