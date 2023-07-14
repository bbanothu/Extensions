chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "jobFinder",
    title: "Job Finder",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "goToCompany",
    title: "Go To Company",
    parentId: "jobFinder",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "findPerson",
    title: "Find Person",
    parentId: "jobFinder",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  const text = info.selectionText;
  
  if (info.menuItemId === "goToCompany") {
    const url = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(text)}`;
    chrome.tabs.create({ url: url });
  } else if (info.menuItemId === "findPerson") {
    const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(text)}`;
    chrome.tabs.create({ url: url });
  }
});