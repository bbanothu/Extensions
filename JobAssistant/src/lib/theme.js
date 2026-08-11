const KEY = 'theme';

export function getStoredTheme() {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (items) => resolve(items[KEY] || 'system'));
  });
}

export function setStoredTheme(theme) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [KEY]: theme }, resolve);
  });
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = theme;
  }
}
