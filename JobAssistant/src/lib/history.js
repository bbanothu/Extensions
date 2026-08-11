const KEY = 'resumeHistory';

export function getHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.get(KEY, (items) => resolve(items[KEY] || []));
  });
}

export async function addHistoryEntry(entry) {
  const history = await getHistory();
  const next = [{ id: crypto.randomUUID(), createdAt: Date.now(), ...entry }, ...history].slice(
    0,
    50,
  );
  await new Promise((resolve) => chrome.storage.local.set({ [KEY]: next }, resolve));
  return next;
}

export async function removeHistoryEntry(id) {
  const history = await getHistory();
  const next = history.filter((h) => h.id !== id);
  await new Promise((resolve) => chrome.storage.local.set({ [KEY]: next }, resolve));
  return next;
}
