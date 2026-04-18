// NotebookLM Extension - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('status');
  const statusTextEl = document.getElementById('status-text');
  const cacheTextEl = document.getElementById('cache-text');
  const cacheMetaEl = document.getElementById('cache-meta');
  const CACHE_KEY = 'awesomelm_template_cache_v1';
  const TTL_MS = 60 * 60 * 1000;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab && tab.url && tab.url.includes('notebooklm.google.com')) {
      statusEl.classList.add('active');
      statusTextEl.textContent = 'Extension is active on this page.';
    } else {
      statusTextEl.textContent = 'Open NotebookLM to use the AwesomeLM template picker.';
    }
  } catch (error) {
    console.error('[NLM Extension] Failed to inspect active tab:', error);
    statusTextEl.textContent = 'Could not inspect the current tab.';
  }

  try {
    const stored = await chrome.storage.local.get(CACHE_KEY);
    const record = stored[CACHE_KEY];

    if (!record || !Array.isArray(record.templates) || record.templates.length === 0) {
      cacheTextEl.textContent = 'No cached templates yet.';
      cacheMetaEl.textContent = 'Open the template picker once to cache AwesomeLM templates for 1 hour.';
      return;
    }

    const fetchedAt = Number(record.fetchedAt) || 0;
    const ageMs = Date.now() - fetchedAt;
    const isFresh = fetchedAt > 0 && ageMs < TTL_MS;
    const minutes = Math.max(1, Math.round(ageMs / 60000));

    cacheTextEl.textContent = `${record.templates.length} templates cached (${isFresh ? 'fresh' : 'stale'}).`;
    cacheMetaEl.textContent = fetchedAt
      ? `Last updated about ${minutes} minute${minutes === 1 ? '' : 's'} ago.`
      : 'Cache timestamp unavailable.';
  } catch (error) {
    console.error('[NLM Extension] Failed to inspect cache:', error);
    cacheTextEl.textContent = 'Could not read template cache.';
    cacheMetaEl.textContent = '';
  }
});
