let screenWidth = screen.availWidth;
let screenHeight = screen.availHeight;
let width = 500;
let height = 300;

let blockedDomains;
let domainArray;
let blockActive = false;

function filterInt() {
  const _filterInt = setInterval(function() {
    chrome.storage.sync.get({
      timerEnd: 0
    }, function(items) {
      let endingTimestampSeconds = items.timerEnd;
      let currentTimestampSeconds = Date.now() / 1000;

      if (endingTimestampSeconds - currentTimestampSeconds > 0) {
        blockActive = true;
      } else {
        blockActive = false;
        clearInterval(_filterInt);
      }
    });
  }, 60000);
}

function requestListener() {
  if (blockActive) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      let currentUrl = tabs[0].url;
      let currentTabId = tabs[0].id;
      let currentUrlString = currentUrl.split(/\/\/|\//)[1];

      for (let i = 0; i < blockedDomains.length; i++) {
        let domain = blockedDomains[i].replace(/\s/g, '');
        if (currentUrlString.includes(domain)) {
          // chrome.windows.create({
          //   url: "dialog.html",
          //   type: "panel",
          //   focused: true,
          //   width: width,
          //   height: height,
          //   left: Math.round((screenWidth-width)/2),
          //   top: Math.round((screenHeight-height)/2)
          // });
          chrome.storage.sync.set({
            navigationUrl: currentUrl
          }, function() {
            chrome.tabs.update(currentTabId, {url: "redirect.html"});
          });
          return;
        }
      }
    });
    return {cancel: true}
  } else {
    return {cancel: false}
  }
}

chrome.storage.sync.get({
    blockedSites: ["facebook.com", "twitter.com"],
    timerEnd: 0
  }, function(items) {
    blockedDomains = items.blockedSites;
    let endingTimestampSeconds = items.timerEnd;
    let currentTimestampSeconds = Date.now() / 1000;
    if (endingTimestampSeconds - currentTimestampSeconds > 0) {
      blockActive = true;
      filterInt();
    } else {
      blockActive = false;
    }
    domainArray = blockedDomains.map ( (domain) => (
      `*://*.${domain}/*`
    )
  );

  chrome.webRequest.onBeforeRequest.removeListener(requestListener);
  chrome.webRequest.onBeforeRequest.addListener(requestListener, {
    urls: domainArray
  }, ["blocking"]);
});

chrome.storage.onChanged.addListener(function() {
  chrome.storage.sync.get({
      blockedSites: ["facebook.com", "twitter.com"],
      timerEnd: 0
    }, function(items) {
      blockedDomains = items.blockedSites;
      let endingTimestampSeconds = items.timerEnd;
      let currentTimestampSeconds = Date.now() / 1000;
      if (endingTimestampSeconds - currentTimestampSeconds > 0) {
        blockActive = true;
        filterInt();
      } else {
        blockActive = false;
      }
      domainArray = blockedDomains.map ( (domain) => (
        `*://*.${domain}/*`
      ));

    chrome.webRequest.onBeforeRequest.removeListener(requestListener);
    chrome.webRequest.onBeforeRequest.addListener(requestListener, {
      urls: domainArray
    }, ["blocking"]);
  });
});
