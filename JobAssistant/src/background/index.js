chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'jobFinder',
    title: 'Job Finder',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'goToCompany',
    title: 'Go To Company',
    parentId: 'jobFinder',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'findPerson',
    title: 'Find Person',
    parentId: 'jobFinder',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const text = info.selectionText;
  if (info.menuItemId === 'goToCompany') {
    chrome.tabs.create({
      url: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(text)}`,
    });
  } else if (info.menuItemId === 'findPerson') {
    chrome.tabs.create({
      url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(text)}`,
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'fetchPageText') {
    fetchPageText(request.url)
      .then(sendResponse)
      .catch((err) => {
        sendResponse({ error: err.message });
      });
    return true;
  }
});

async function fetchPageText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const html = await res.text();
  return { text: htmlToText(html), title: extractTitle(html) };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : '';
}

function htmlToText(html) {
  const withoutJunk = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const withBreaks = withoutJunk.replace(/<(br|\/p|\/div|\/li|\/h[1-6])[^>]*>/gi, '\n');
  const stripped = withBreaks.replace(/<[^>]+>/g, ' ');
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return decoded
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}
