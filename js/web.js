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

    // set selected style
    dropdowns[i].querySelector('.dropdown-item').insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>')
    dropdowns[i].querySelector('.dropdown-item').classList.add('selected-item');
  }
}

// helper function to check if input is a number
function isNumber(str) {
  return !isNaN(str) && str !== "";
}

// opens or closes the selected dropdown
function toggleDropdown(e) {

  // variable declarations
  e.stopPropagation();
  let target = e.target;
  let menu = target.closest('.dropdown').querySelector('.dropdown-menu');
  let menuId = menu.id;

  // dropdown open and close
  dropdownStates[menuId] = !dropdownStates[menuId];
  menu.style.display = dropdownStates[menuId] ? 'flex' : 'none';

  // set choice and update checkmark
  let currChoice = target.id.slice(-1);
  if(isNumber(currChoice)) updateSelection(currChoice, target.closest('.dropdown'));
  else return;
}

// helper function to update the selection logic for dropdowns
function updateSelection(index, dropdown) {

  let menuItems = dropdown.querySelectorAll('.dropdown-item');
  let menuId = dropdown.querySelector('.dropdown-menu').id;

  // remove previous selection
  menuItems[dropdownChoices[menuId]].querySelector('i').remove();
  menuItems[dropdownChoices[menuId]].classList.remove('selected-item');

  // update object
  dropdownChoices[menuId] = index;

  // update new selection
  menuItems[index].insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>');
  menuItems[index].classList.add('selected-item');
  dropdown.querySelector('.dropdown-button').textContent = menuItems[index].textContent;

}

// close all dropdowns
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
