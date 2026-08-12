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
const resumeDraft = storageValue('resumeDraft', {
  mode: 'url',
  resumeText: '',
  resumeFileName: '',
  jobUrl: '',
  jdText: '',
});

export const getResumeDraft = resumeDraft.get;
export const setResumeDraft = resumeDraft.set;

const DEFAULT_TILES = [
  {
    id: 'linkedin-jobs',
    label: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs',
    x: 0,
    y: 0,
    w: 6,
    h: 8,
  },
  { id: 'indeed', label: 'Indeed', url: 'https://www.indeed.com', x: 6, y: 0, w: 6, h: 8 },
];
const gridTiles = storageValue('gridTiles', DEFAULT_TILES);

export const getGridTiles = gridTiles.get;
export const setGridTiles = gridTiles.set;

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
