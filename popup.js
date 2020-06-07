let button;
let input;
let optionsLink;
let inputContainer;
let timerContainer;
let startTimeSeconds;

function iconMouseOver(e) {
  if (input.value > 0) {
    button.style.color = "#1ED760";
    button.className = "fa fa-play-circle";
    button.addEventListener('click', setupInitialTimer);
  } else {
    button.style.color = "#c4c4c4";
  }
}

function iconMouseOut(e) {
  button.className = "fa fa-circle-thin"
  button.removeEventListener('click', setupInitialTimer);
}

function setupInitialTimer() {
  let startTime = input.value;
  startTimeSeconds = startTime * 60;

  if (inputContainer.firstChild) {
    inputContainer.removeChild(input);
  }
  let timerSpan = document.createElement("SPAN");
  timerSpan.setAttribute("id", "countdown-clock");
  if (startTime > 0 && startTime < 10) {
    timerSpan.innerHTML = `0${startTime}:00`;
  } else if (startTime > 0) {
    timerSpan.innerHTML = `${startTime}:00`;
  } else {
    timerSpan.innerHTML = "";
  }
  inputContainer.appendChild(timerSpan);

  let currentTimestampSeconds = Date.now() / 1000;
  let endingTimestampSeconds = currentTimestampSeconds + startTimeSeconds;

  chrome.storage.sync.set({
    timerEnd: endingTimestampSeconds
  }, function() {
    startTimer(startTimeSeconds, timerSpan);
  });
}

function setupTimer() {
  if (inputContainer.firstChild) {
    inputContainer.removeChild(input);
  }
  let timerSpan = document.createElement("SPAN");
  timerSpan.setAttribute("id", "countdown-clock");
  timerSpan.innerHTML = "&nbsp;";
  inputContainer.appendChild(timerSpan);

  startTimer(startTimeSeconds, timerSpan);
}

function clockDisplay(duration, display) {
  minutes = parseInt(duration / 60, 10);
  seconds = parseInt(duration % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  display.textContent = minutes + ":" + seconds;
}

function startTimer(duration, display) {
  clockDisplay(duration, display);
  let clockInterval = setInterval(function () {
    clockDisplay(duration - 1, display);
    duration--;
    if (duration <= 0) {
      inputContainer.innerHTML = '';
      inputContainer.appendChild(input);
      button.className = "fa fa-circle-thin";
      button.addEventListener('mouseover', iconMouseOver);
      button.addEventListener('mouseout', iconMouseOut);
      clearInterval(clockInterval);
      return;
    }
  }, 1000);
  button.className = "fa fa-circle-o-notch fa-spin";
  button.removeEventListener('mouseover', iconMouseOver);
  button.removeEventListener('mouseout', iconMouseOut);
  button.addEventListener('mouseover', stopTimerOver);
  button.addEventListener('mouseout', stopTimerOut);
}

function stopTimerOver() {
  let currentWidth = button.offsetWidth;
  button.className = "fa fa-stop-circle-o";
  button.style.fontSize = "80px";
  button.style.color = "#D7251E";
  button.addEventListener("click", confirmEndTimer);
}

function stopTimerOut() {
  button.className = "fa fa-circle-o-notch fa-spin";
  button.style.fontSize = "74px";
  button.style.color = "#1ED760";
}

function confirmEndTimer() {
  chrome.tabs.create({url: "endTimer.html"});
}

function openOptions(e) {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
}

document.addEventListener('DOMContentLoaded', function() {
  button = document.getElementById('circle-button');
  input = document.getElementById('minute-input');
  optionsLink = document.getElementById('options-link');
  inputContainer = document.getElementById('minute-input-container');
  timerContainer = document.getElementById('timer-container');

  optionsLink.addEventListener('click', openOptions);

  button.addEventListener('mouseover', iconMouseOver);
  button.addEventListener('mouseout', iconMouseOut);
  let currentTimestampSeconds = Date.now() / 1000;

  chrome.storage.sync.get({
    timerEnd: 0
  }, function(items) {
    let storedEndingTimestampSeconds = items.timerEnd;

    if (storedEndingTimestampSeconds - currentTimestampSeconds > 0) {
      startTimeSeconds = storedEndingTimestampSeconds - currentTimestampSeconds;
      setupTimer();
    }
  });
});
