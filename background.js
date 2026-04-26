// NotebookLM Extension - Background Service Worker

const SUPABASE_URL = 'https://qyhtrqobtwmbymviezcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aHRycW9idHdtYnltdmllemNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODM0NDIsImV4cCI6MjA5MTU1OTQ0Mn0.G9OvB-j49IMGaeniTaAGSuGb1pd0YWKBqlp_59jt7Bc';
const CACHE_KEY = 'awesomelm_template_cache_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes
const REFRESH_ALARM = 'awesomelm_refresh_templates';

// Preload templates from Supabase
async function preloadTemplates() {
  console.log('[NLM Background] Preloading templates from Supabase...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/treasures?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const templates = data.map(row => ({
      id: row.id,
      title: row.title || 'Untitled Template',
      description: row.description || 'No description available.',
      prompt: row.prompt || '',
      imageUrl: row.main_image_url || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      category: row.category || null,
      isFeatured: Boolean(row.is_featured),
      createdAt: row.created_at || '',
      updatedAt: row.updated_at || '',
    }));

    // Store in cache
    await chrome.storage.local.set({
      [CACHE_KEY]: {
        templates,
        fetchedAt: Date.now(),
      },
    });

    console.log(`[NLM Background] ✅ Preloaded ${templates.length} templates into cache`);
    return templates;
  } catch (error) {
    console.error('[NLM Background] Failed to preload templates:', error);
    return null;
  }
}

// Check if cache needs refresh
async function shouldRefreshCache() {
  const stored = await chrome.storage.local.get(CACHE_KEY);
  const record = stored[CACHE_KEY];

  if (!record || !Array.isArray(record.templates)) {
    return true; // No cache, needs refresh
  }

  const fetchedAt = Number(record.fetchedAt) || 0;
  const ageMs = Date.now() - fetchedAt;

  return ageMs >= CACHE_TTL_MS; // Refresh if older than TTL
}

// Setup periodic refresh alarm
async function setupPeriodicRefresh() {
  // Clear existing alarm
  await chrome.alarms.clear(REFRESH_ALARM);
  
  // Create alarm to refresh every 30 minutes
  await chrome.alarms.create(REFRESH_ALARM, {
    periodInMinutes: 30,
  });
  
  console.log('[NLM Background] ✅ Periodic refresh alarm set (every 30 minutes)');
}

// Handle alarm events
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === REFRESH_ALARM) {
    console.log('[NLM Background] Periodic refresh triggered');
    const needsRefresh = await shouldRefreshCache();
    
    if (needsRefresh) {
      await preloadTemplates();
    } else {
      console.log('[NLM Background] Cache still fresh, skipping refresh');
    }
  }
});

// Extension installed or updated
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[NLM Extension] Extension installed or updated:', details.reason);
  
  // Preload templates immediately on install/update
  await preloadTemplates();
  
  // Setup periodic refresh
  await setupPeriodicRefresh();
});

// Extension startup (browser restart)
chrome.runtime.onStartup.addListener(async () => {
  console.log('[NLM Extension] Browser started, checking cache...');
  
  const needsRefresh = await shouldRefreshCache();
  
  if (needsRefresh) {
    await preloadTemplates();
  } else {
    console.log('[NLM Background] Cache is fresh, no preload needed');
  }
  
  // Ensure alarm is set
  await setupPeriodicRefresh();
});
