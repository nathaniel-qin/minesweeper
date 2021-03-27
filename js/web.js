var dropdownStates = {};
var dropdownChoices = {};
var openOrClosed = [true, false]

window.onload = function() {

  // add event listeners
  document.body.addEventListener('click', closeDropdowns);
  let dropdowns = document.getElementsByClassName('dropdown');
  for(let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', toggleDropdown);

    //populate objects
    let menuId = dropdowns[i].querySelector('.dropdown-menu').id;
    dropdownStates[menuId] = false;
    dropdownChoices[menuId] = 0;
  }
}

function toggleDropdown(e) {

  // variable declarations
  e.stopPropagation();
  let target = e.target;
  let menu = target.closest('.dropdown').querySelector('.dropdown-menu');
  let menuId = menu.id;

  // dropdown open and close
  dropdownStates[menuId] = !dropdownStates[menuId];
  menu.style.display = dropdownStates[menuId] ? 'flex' : 'none';

  // set choice
  let choice = target.id.slice(-1);
  if(choice) dropdownChoices[menuId] = target.id.slice(-1);
}

function closeDropdowns() {

  // reset dropdownStates object
  let dropdowns = document.getElementsByClassName('dropdown-menu');
  Object.keys(dropdownStates).forEach(function(i) {
    dropdownStates[i] = false;
  });

  // close all dropdowns
  for(let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].style.display = "none";
  }
}
