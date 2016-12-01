
let blockedList = document.getElementById("blocked-list");
let blockedListItems = document.querySelectorAll("#blocked-list li");

// Saves options to chrome.storage
function save_options() {
  let blockedSitesArray = [];
  blockedListItems = document.querySelectorAll("#blocked-list li");
  blockedListItems.forEach ((item) => {
    blockedSitesArray.push(item.innerText);
  });
  chrome.storage.sync.set({
    blockedSites: blockedSitesArray
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

function removeBlockedSite(e) {

  chrome.storage.sync.get({
    timerEnd: 0
  }, function(items) {
    let endingTimestampSeconds = items.timerEnd;
    let currentTimestampSeconds = Date.now() / 1000;

    if (endingTimestampSeconds - currentTimestampSeconds > 0) {
      alert('End timer before removing sites');
    } else {
      let targetLi = e.target.parentNode;
      let parentUl = targetLi.parentNode;
      parentUl.removeChild(targetLi);
    }
  });
}

function addBlockedSite(e) {
  let inputField = document.getElementById('add-blocked-site');
  let inputValue = inputField.value;
  let formatted = inputValue.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
  let formattedUrl = formatted ? formatted[1] : inputValue.replace("www.", "");

  let node = document.createElement("LI");
  let icon = "<i class='fa fa-minus-square remove-site-icon' aria-hidden='true'></i>";
  node.innerHTML = `${formattedUrl} ${icon}`;
  if (formattedUrl !== "") {
    blockedList.appendChild(node);
    blockedList.lastChild.addEventListener('click', removeBlockedSite);
    inputField.value = "";
  }
}

function restore_options() {
  chrome.storage.sync.get({
    blockedSites: ["facebook.com", "twitter.com"]
  }, function(items) {
    items.blockedSites.forEach( (site) => {
      let node = document.createElement("LI");
      let icon = "<i class='fa fa-minus-square remove-site-icon' aria-hidden='true'></i>";
      node.innerHTML = `${site} ${icon}`;
      blockedList.appendChild(node);
    });

    let listItems = document.querySelectorAll(".remove-site-icon");
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].addEventListener('click', removeBlockedSite);
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('add-blocked-site-icon').addEventListener('click',
    addBlockedSite);
document.getElementById('save').addEventListener('click',
    save_options);








//
