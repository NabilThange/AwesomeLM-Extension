// NotebookLM Extension - Background Service Worker

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[NLM Extension] Extension installed or updated:', details.reason);
});
