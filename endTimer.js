let formSteps;
let correctArrows = 0;

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cancel-alpha').addEventListener('click',
  cancelNavigation);
  document.getElementById('cancel-beta').addEventListener('click',
  cancelNavigation);
  document.getElementById('confirm-alpha').addEventListener('click',
  confirmNavigationAlpha);
  formSteps = document.getElementsByClassName("form-step");
});

const arrows = ["up", "down", "right", "left"]

function createArrowSequence(display) {
  let arrowSequence = [];
  for (let i = 0; i < 46; i++) {
    let arrow = arrows[Math.floor(Math.random() * arrows.length)];
    arrowSequence.push(arrow);
  }
  arrowIconSequence = arrowSequence.map( (direction) => (
    `fa fa-arrow-${direction}`
  ));

  arrowIconSequence.forEach( (classes) => {
    let node = document.createElement("I");
    node.className = classes;
    display.appendChild(node);
  })

  inputSequence(display, arrowSequence);
}

function inputSequence(display, sequence) {
  let i = 0;
  let input;
  let button = document.getElementById('confirm-beta');
  let children = display.childNodes;

  window.onkeydown = (e) => {
    switch (e.keyCode) {
      case 38:
        input = "up";
        break;
      case 39:
        input = "right";
        break;
      case 40:
        input = "down";
        break;
      case 37:
        input = "left";
        break;
      default:
        input = null;
        break;
    }

    if (sequence[i] === input) {
      children[i].style.color = "#058A35";
      i++;
    }
    if (i === sequence.length) {
      button.className = "confirm";
      button.addEventListener("click", confirmNavigationBeta);
    }
  };
}

function cancelNavigation(e) {
  e.preventDefault();
  let status = document.getElementById('message-container');
  status.textContent = 'Way to hang in there!';
  chrome.tabs.getCurrent(function(tab) {
    setTimeout(function() {
      chrome.tabs.remove(tab.id);
    }, 1800);
  });
}

function confirmNavigationAlpha() {
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].className.match(/hidden/)) {
      formSteps[i].className = "form-step"
    } else {
      formSteps[i].className = "form-step hidden"
    }
  }

  let arrowContainer = document.getElementById('arrow-sequence');
  createArrowSequence(arrowContainer);
}

function confirmNavigationBeta() {
  let currentTimestampSeconds = Date.now() / 1000;
  chrome.storage.sync.set({
    timerEnd: currentTimestampSeconds
  }, function() {
    chrome.tabs.getCurrent(function(tab) {
      let status = document.getElementById('message-container');
      status.textContent = 'Timer Ended.';
      setTimeout(function() {
        chrome.tabs.remove(tab.id);
      }, 1800);
    });
  });
}
