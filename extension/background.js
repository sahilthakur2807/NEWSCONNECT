chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openSidePanel") {
    chrome.sidePanel.open({ tabId: sender.tab.id });
    // Store the URL and Title of the article to discuss
    chrome.storage.local.set({ targetUrl: message.url, targetTitle: message.title });
  }
});
