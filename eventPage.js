let screenWidth = screen.availWidth;
let screenHeight = screen.availHeight;
let width = 500;
let height = 300;

let blockedDomains;
let domainArray;

function requestListener(e) {
  checkDomains(e.url, blockedDomains);
  return {cancel: true};
}

chrome.storage.onChanged.addListener(function() {
  chrome.storage.sync.get({
    blockedSites: ["facebook.com", "twitter.com"]
    }, function(items) {
      blockedDomains = items.blockedSites;
      domainArray = blockedDomains.map ( (domain) => (
        `*://*.${domain}/*`
      ));

    chrome.webRequest.onBeforeRequest.removeListener(requestListener);
    chrome.webRequest.onBeforeRequest.addListener(requestListener, {
      urls: domainArray
    }, ["blocking"]);
  });
});

function checkDomainsWithUrl(currentUrlString, blockedDomains) {
  for (let i = 0; i < blockedDomains.length; i++) {
    let domain = blockedDomains[i].replace(/\s/g, '');
    if (currentUrlString.includes(domain)) {
      chrome.windows.create({
        url: "dialog.html",
        type: "panel",
        focused: true,
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
      });
      return;
    }
  }
}

function checkDomains(eventUrl, blockedDomains) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentUrl = tabs[0].url;
    let currentUrlString = currentUrl.split(/\/\/|\//)[1];

    return checkDomainsWithUrl(currentUrlString, blockedDomains);
  });
}

chrome.storage.sync.get({
  blockedSites: ["facebook.com", "twitter.com"]
  }, function(items) {
    blockedDomains = items.blockedSites;
    domainArray = blockedDomains.map ( (domain) => (
      `*://*.${domain}/*`
    )
  );

  chrome.webRequest.onBeforeRequest.removeListener(requestListener);
  chrome.webRequest.onBeforeRequest.addListener(requestListener, {
    urls: domainArray
  }, ["blocking"]);
});
