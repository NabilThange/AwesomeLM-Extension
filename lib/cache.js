// NotebookLM Extension - Cache Helpers

(function() {
  'use strict';

  const CACHE_KEY = 'awesomelm_template_cache_v1';
  const CACHE_TTL_MS = 60 * 60 * 1000;

  async function getCacheRecord() {
    const stored = await chrome.storage.local.get(CACHE_KEY);
    const record = stored[CACHE_KEY];

    if (!record || !Array.isArray(record.templates)) {
      return {
        templates: [],
        fetchedAt: 0,
        isFresh: false,
        hasData: false,
      };
    }

    const fetchedAt = Number(record.fetchedAt) || 0;
    const ageMs = Date.now() - fetchedAt;

    return {
      templates: record.templates,
      fetchedAt,
      ageMs,
      isFresh: fetchedAt > 0 && ageMs < CACHE_TTL_MS,
      hasData: record.templates.length > 0,
    };
  }

  async function setCacheRecord(templates) {
    const record = {
      templates,
      fetchedAt: Date.now(),
    };

    await chrome.storage.local.set({
      [CACHE_KEY]: record,
    });

    return record;
  }

  async function clearCacheRecord() {
    await chrome.storage.local.remove(CACHE_KEY);
  }

  window.AwesomeLMTemplateCache = {
    CACHE_KEY,
    CACHE_TTL_MS,
    get: getCacheRecord,
    set: setCacheRecord,
    clear: clearCacheRecord,
  };
})();
