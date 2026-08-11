function storageValue(key, defaultValue) {
  return {
    get: () =>
      new Promise((resolve) => {
        chrome.storage.local.get(key, (items) => resolve(items[key] ?? defaultValue));
      }),
    set: (value) =>
      new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      }),
  };
}

const apiKey = storageValue('anthropicApiKey', '');
const provider = storageValue('provider', 'anthropic');
const ollamaModel = storageValue('ollamaModel', '');
const openRouterKey = storageValue('openRouterApiKey', '');
const openRouterModel = storageValue('openRouterModel', '');

export const getApiKey = apiKey.get;
export const setApiKey = apiKey.set;
export const getProvider = provider.get;
export const setProvider = provider.set;
export const getOllamaModel = ollamaModel.get;
export const setOllamaModel = ollamaModel.set;
export const getOpenRouterKey = openRouterKey.get;
export const setOpenRouterKey = openRouterKey.set;
export const getOpenRouterModel = openRouterModel.get;
export const setOpenRouterModel = openRouterModel.set;
