
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('cancel-alpha').addEventListener('click',
  cancelNavigation);
  document.getElementById('confirm-alpha').addEventListener('click',
  confirmNavigationAlpha);
});

function cancelNavigation() {

}

function confirmNavigationAlpha() {
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
