let button;
let input;
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

  inputContainer.removeChild(input);
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
  inputContainer.removeChild(input);
  let timerSpan = document.createElement("SPAN");
  timerSpan.setAttribute("id", "countdown-clock");
  timerSpan.innerHTML = "";
  inputContainer.appendChild(timerSpan);

  startTimer(startTimeSeconds, timerSpan);
}

function startTimer(duration, display) {
  let clockInterval = setInterval(function () {
    minutes = parseInt(duration / 60, 10);
    seconds = parseInt(duration % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

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
}

document.addEventListener('DOMContentLoaded', function() {
  button = document.getElementById('circle-button');
  input = document.getElementById('minute-input');
  inputContainer = document.getElementById('minute-input-container');
  timerContainer = document.getElementById('timer-container');
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











//
