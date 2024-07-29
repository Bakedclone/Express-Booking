chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes("irctc.co.in/nget/booking/train-list")) {
      sendMessageToTab(tabId, { action: "train-list" });
    }
    if (tab.url.includes("irctc.co.in/nget/booking/psgninput")) {
      sendMessageToTab(tabId, { action: "passenger-input" });
    }
  }
});

function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, response => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("Message sent successfully:", response);
    }
  });
}
