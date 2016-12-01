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

function cancelNavigation() {
  chrome.storage.sync.get({
    prevUrl: "chrome://newtab"
  }, function(items) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      let currentTabId = tabs[0].id;
      chrome.tabs.update(currentTabId, {url: items.prevUrl});
    });
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
    chrome.storage.sync.get({
      navigationUrl: "redirect.html"
    }, function(items) {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        let currentTabId = tabs[0].id;
        chrome.tabs.update(currentTabId, {url: items.navigationUrl});
      });
    });
  });
}
