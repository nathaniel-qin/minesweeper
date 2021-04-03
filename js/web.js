var dropdownStates = {};
var dropdownChoices = {};
var openOrClosed = [true, false]

window.onload = function() {

  // add event listeners
  document.body.addEventListener('click', closeDropdowns);

  // make sure winning music will loop
  yeet.addEventListener('ended', function () {
    yeeet.play();
  });

  document.getElementById('toggleSound').addEventListener('click', toggleMute);
  document.getElementById('resetButton').addEventListener('click', resetBoard);
  document.getElementById('playAgainButton').addEventListener('click', resetBoard);
  document.getElementsByClassName('game-board')[0].addEventListener('contextmenu', preventRightClick);

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

  // set page content
  updateDifficulty(dropdownChoices.difficulty);
}

// helper function to check if input is a number
function isNumber(str) {
  return !isNaN(str) && str !== "";
}

// mutes or unmutes the game sounds
function toggleMute() {

  isMuted = !isMuted;

  // toggle sound icon
  let soundIcon = document.getElementById('toggleSoundIcon');
  if(isMuted) {
    soundIcon.classList.remove('fa-volume-up');
    soundIcon.classList.add('fa-volume-mute');
    yeet.volume = MUTE_VOLUME;
    yeeet.volume = MUTE_VOLUME;
    sadge.volume = MUTE_VOLUME;
    pop.volume = MUTE_VOLUME;
    oops.volume = MUTE_VOLUME;
    flagPlace.volume = MUTE_VOLUME;
    flagRemove.volume = MUTE_VOLUME;
  } else {
    soundIcon.classList.remove('fa-volume-mute');
    soundIcon.classList.add('fa-volume-up');
    yeet.volume = YEET_VOLUME;
    yeeet.volume = YEEET_VOLUME;
    sadge.volume = SADGE_VOLUME;
    pop.volume = POP_VOLUME;
    oops.volume = OOPS_VOLUME;
    flagPlace.volume = FLAGPLACE_VOLUME;
    flagRemove.volume = FLAGREMOVE_VOLUME;
  }
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
  dropdown.querySelector('.dropdown-button').childNodes[0].nodeValue = menuItems[index].childNodes[0].nodeValue;

  // update rest of page
  if(menuId === 'difficulty') updateDifficulty(dropdownChoices[menuId]);
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

// prevents right click menu from opening and disrupting the game
function preventRightClick(e) {
  e.preventDefault();
  return false;
}
