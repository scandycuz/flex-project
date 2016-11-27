let screenWidth = screen.availWidth;
let screenHeight = screen.availHeight;
let width = 500;
let height = 300;

let blockedDomains = ["facebook.com", "twitter.com"];
let domainArray = blockedDomains.map ( (domain) => (
  `*://*.${domain}/*`
));

function checkDomainsWithUrl(currentUrlString) {
  for (let i = 0; i < blockedDomains.length; i++) {
    if (currentUrlString.indexOf(blockedDomains[i]) !== -1) {
      chrome.windows.create({
        url: "dialog.html",
        type: "panel",
        focused: true,
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
      });
    }
  }
}

function checkDomains(eventUrl) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentUrl = tabs[0].url;
    let currentUrlString = currentUrl.split(/\/\/|\//)[1];

    return checkDomainsWithUrl(currentUrlString);
  });
}

chrome.webRequest.onBeforeRequest.addListener(function(e) {
  checkDomains(e.url);
  return {cancel: true};
}, {
  urls: domainArray
}, ["blocking"]);
