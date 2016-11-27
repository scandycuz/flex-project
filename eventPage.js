let screenWidth = screen.availWidth;
let screenHeight = screen.availHeight;
let width = 500;
let height = 300;

let blockedDomains = ["facebook.com"];

function checkDomains(currentUrlString) {
  blockedDomains.forEach((domain) => {
    if (currentUrlString.indexOf(domain) !== -1) {
      chrome.windows.create({
        url: "dialog.html",
        type: "popup",
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
      });
    }
  })
}

chrome.webNavigation.onCommitted.addListener(function(e) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentUrl = tabs[0].url;
    let currentUrlString = currentUrl.split(/\/\/|\//)[1];

    checkDomains(currentUrlString);
  });

}, {url: [
  {hostSuffix: 'facebook.com'}
]});
