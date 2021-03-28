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

    // set checkmark
    dropdowns[i].querySelector('.dropdown-item').insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>')
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
  if(isNumber(currChoice)) updateSelection(currChoice, menu.querySelectorAll('.dropdown-item'), menuId);
  else return;
}

// helper function to update the selection logic for dropdowns
function updateSelection(index, menuItems, menuId) {

  console.log(index + " " + menuItems);
  // remove previous checkmark
  menuItems[dropdownChoices[menuId]].querySelector('i').remove();

  // update object
  dropdownChoices[menuId] = index;

  // update new selection
  menuItems[index].insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>');
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
