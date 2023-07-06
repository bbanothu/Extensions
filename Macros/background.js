chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveMessage") {
    chrome.storage.sync.set({ "savedMessage": request.message });
    sendResponse({ message: "Message saved!" });
  } else if (request.action === "getMessage") {
    chrome.storage.sync.get("savedMessage", (items) => {
      sendResponse({ message: items.savedMessage });
    });
    return true;  // Will respond asynchronously.
  }
});
