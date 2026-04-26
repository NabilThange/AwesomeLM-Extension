// NotebookLM Extension - Content Script
// Detects the slide deck modal, injects a trigger, and manages the template picker.

(function() {
  'use strict';

  if (!window.location.hostname.includes('notebooklm.google.com')) {
    return;
  }

  const TRIGGER_ID = '__nlm-ext-icon';
  const STYLESHEET_ID = '__nlm-ext-overlay-css';
  const CAROUSEL_STYLES_ID = '__nlm-ext-carousel-css';
  let overlayController = null;
  let carouselInjected = false;

  function ensureStylesheet() {
    if (document.getElementById(STYLESHEET_ID)) {
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.id = STYLESHEET_ID;
    cssLink.rel = 'stylesheet';
    cssLink.href = chrome.runtime.getURL('overlay.css');
    document.head.appendChild(cssLink);
  }

  function ensureCarouselStyles() {
    if (document.getElementById(CAROUSEL_STYLES_ID)) {
      return;
    }

    const styleEl = document.createElement('style');
    styleEl.id = CAROUSEL_STYLES_ID;
    styleEl.textContent = `
      #nlm-carousel-v21 {
        all: unset;
        display: block !important;
        width: 100% !important;
        overflow: hidden !important;
        margin: 12px 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        animation: fadeIn21 0.25s ease !important;
      }
      @keyframes fadeIn21 {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #nlm-carousel-v21 * { box-sizing: border-box; margin: 0; padding: 0; }
      .c21-header { display: flex !important; align-items: center !important; justify-content: space-between !important; margin-bottom: 8px !important; gap: 8px !important; width: 100% !important; }
      .c21-title { font-size: 12px !important; font-weight: 500 !important; color: #e8eaed !important; margin: 0 !important; flex-shrink: 0 !important; }
      .c21-nav { display: flex !important; gap: 6px !important; flex-shrink: 0 !important; margin-left: auto !important; }
      .c21-btn { width: 32px !important; height: 32px !important; border-radius: 50% !important; border: 1px solid rgba(255,255,255,0.25) !important; background: transparent !important; color: #9aa0a6 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 20px !important; padding: 0 !important; margin: 0 !important; transition: all 0.15s ease !important; flex-shrink: 0 !important; }
      .c21-btn:hover { border-color: #8ab4f8 !important; color: #8ab4f8 !important; background: rgba(138,180,248,0.08) !important; }
      .c21-wrap { width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; scrollbar-width: none !important; -ms-overflow-style: none !important; }
      .c21-wrap::-webkit-scrollbar { display: none !important; }
      .c21-track { display: flex !important; gap: 12px !important; width: max-content !important; padding-bottom: 4px !important; }
      .c21-card { flex: 0 0 140px !important; width: 140px !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; transition: opacity 0.2s !important; }
      .c21-card:hover { opacity: 0.82 !important; }
      .c21-thumb { width: 100% !important; height: 105px !important; border-radius: 10px !important; overflow: hidden !important; border: 2.5px solid transparent !important; background: #3a3b3e !important; position: relative !important; flex-shrink: 0 !important; transition: border-color 0.2s !important; }
      .c21-thumb img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }
      .c21-card.sel .c21-thumb { border-color: #8ab4f8 !important; box-shadow: 0 0 0 1px #8ab4f8 !important; }
      .c21-card.sel .c21-lbl { color: #8ab4f8 !important; font-weight: 500 !important; }
      .c21-check { position: absolute !important; top: 7px !important; right: 7px !important; width: 22px !important; height: 22px !important; border-radius: 50% !important; background: #8ab4f8 !important; display: flex !important; align-items: center !important; justify-content: center !important; opacity: 0 !important; transform: scale(0.4) !important; transition: opacity 0.2s, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) !important; pointer-events: none !important; }
      .c21-card.sel .c21-check { opacity: 1 !important; transform: scale(1) !important; }
      .c21-lbl { font-size: 13px !important; font-weight: 400 !important; color: #e8eaed !important; margin-top: 8px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; line-height: 1.3 !important; }
    `;
    document.head.appendChild(styleEl);
  }

  function getOverlay() {
    if (!overlayController) {
      overlayController = window.AwesomeLMTemplateOverlay.create({
        onFill({ template, format, length }) {
          window.AwesomeLMNLM.fillTemplate({
            format,
            length,
            prompt: template.prompt,
          });
          overlayController.setNotice(`Filled "${template.title}" into NotebookLM.`, 'success');
          setTimeout(() => overlayController.close(), 250);
        },
        onBuild({ template, format, length }) {
          window.AwesomeLMNLM.fillTemplate({
            format,
            length,
            prompt: template.prompt,
            autoGenerate: true,
          });
          overlayController.setNotice(`Building "${template.title}" - filling and generating...`, 'success');
          setTimeout(() => overlayController.close(), 250);
        },
      });
    }

    return overlayController;
  }

  async function loadTemplatesForOverlay() {
    const overlay = getOverlay();
    const cache = await window.AwesomeLMTemplateCache.get();

    if (cache.isFresh && cache.hasData) {
      overlay.setTemplates(cache.templates, {
        noticeText: '',
      });
      return;
    }

    if (cache.hasData) {
      overlay.setLoading('Showing cached templates while refreshing...', cache.templates);
    } else {
      overlay.setLoading('Loading templates from AwesomeLM...');
    }

    try {
      const templates = await window.AwesomeLMSupabase.fetchTemplates();
      await window.AwesomeLMTemplateCache.set(templates);
      overlay.setTemplates(templates, {
        noticeText: cache.hasData ? 'Templates refreshed from AwesomeLM.' : '',
        noticeTone: 'success',
      });
    } catch (error) {
      console.error('[NLM Extension] Failed to fetch templates:', error);

      if (cache.hasData) {
        overlay.setTemplates(cache.templates, {
          noticeText: 'Could not refresh live templates. Showing cached results.',
          noticeTone: 'warning',
          keepSelection: true,
        });
        return;
      }

      overlay.setTemplates(window.AwesomeLMSupabase.FALLBACK_TEMPLATES, {
        noticeText: 'Could not load live templates. Showing bundled fallback templates.',
        noticeTone: 'warning',
        emptyText: 'No live templates available right now.',
      });
    }
  }

  function removeTrigger() {
    const button = document.getElementById(TRIGGER_ID);
    if (button && button.parentElement) {
      button.parentElement.removeChild(button);
    }
    
    // Also remove carousel when modal closes
    const carousel = document.getElementById('nlm-carousel-v21');
    if (carousel) {
      carousel.remove();
    }
    carouselInjected = false;
  }

  function injectTrigger(context) {
    if (!context || !context.container) {
      return;
    }

    if (document.getElementById(TRIGGER_ID)) {
      return;
    }

    const container = context.container;
    const originalPosition = getComputedStyle(container).position;
    if (originalPosition === 'static') {
      container.style.position = 'relative';
    }

    const button = document.createElement('button');
    button.id = TRIGGER_ID;
    button.type = 'button';
    button.className = 'nlm-trigger-btn';
    button.title = 'Open AwesomeLM template library';
    button.setAttribute('aria-label', 'Open AwesomeLM template library');
    button.appendChild(window.AwesomeLMNLM.createIconGraphic());

    button.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      ensureStylesheet();
      getOverlay().open();
      await loadTemplatesForOverlay();
    });

    container.appendChild(button);
  }

  function injectCarousel(templates) {
    // Prevent re-injection if already injected
    if (carouselInjected && document.getElementById('nlm-carousel-v21')) {
      return;
    }

    console.log('[NLM Carousel] Attempting to inject carousel with', templates?.length, 'templates');
    
    if (!templates || templates.length === 0) {
      console.warn('[NLM Carousel] No templates available');
      return;
    }

    // Ensure CSS is loaded
    ensureCarouselStyles();

    // Remove existing carousel
    const existing = document.getElementById('nlm-carousel-v21');
    if (existing) {
      existing.remove();
      console.log('[NLM Carousel] Removed existing carousel');
    }

    // Wait for Format section to be available with MutationObserver
    function waitForFormatSection() {
      return new Promise((resolve) => {
        const findFormatSection = () => {
          // Strategy 1: Look for .dialog-section with Format label
          const sections = document.querySelectorAll('.dialog-section');
          
          for (const section of sections) {
            const labels = section.querySelectorAll('.control-label, label');
            for (const lbl of labels) {
              if (lbl.textContent.trim() === 'Format') {
                console.log('[NLM Carousel] Found Format section via .dialog-section');
                return section;
              }
            }
          }

          // Strategy 2: Fallback - find any element with "Format" text
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            if (node.textContent && node.textContent.trim() === 'Format') {
              let el = node.parentElement;
              while (el && !el.classList.contains('dialog-section')) {
                el = el.parentElement;
              }
              if (el) {
                console.log('[NLM Carousel] Found Format section via text walker');
                return el;
              }
            }
          }
          return null;
        };

        const formatSection = findFormatSection();
        if (formatSection) {
          resolve(formatSection);
          return;
        }

        // If not found, observe for changes
        const observer = new MutationObserver(() => {
          const section = findFormatSection();
          if (section) {
            observer.disconnect();
            resolve(section);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Timeout after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 5000);
      });
    }

    // Wait for Format section and inject carousel
    waitForFormatSection().then((formatSection) => {
      if (!formatSection) {
        console.error('[NLM Carousel] Could not find Format section after 5 seconds');
        return;
      }

      console.log('[NLM Carousel] Creating carousel element...');
      const carousel = window.AwesomeLMNLM.createCarousel(templates, (template) => {
        console.log('[NLM Carousel] Template selected:', template.title);
        // Just store the template selection, don't trigger fillTemplate yet
        // The user will manually hit Generate when ready
      });

      formatSection.insertAdjacentElement('afterend', carousel);
      carouselInjected = true;
      console.log('[NLM Carousel] ✅ Carousel injected successfully');
    });
  }

  function syncToCurrentModal() {
    const context = window.AwesomeLMNLM.findModalContext();

    if (!context || !context.modal) {
      removeTrigger();
      return;
    }

    injectTrigger(context);
    
    // Inject carousel - improved timing with cache check
    setTimeout(async () => {
      try {
        const cache = await window.AwesomeLMTemplateCache.get();
        
        if (cache.hasData) {
          console.log('[NLM Carousel] Using cached templates:', cache.templates.length, '(fresh:', cache.isFresh + ')');
          injectCarousel(cache.templates);
          
          // If cache is stale, refresh in background
          if (!cache.isFresh) {
            console.log('[NLM Carousel] Cache stale, refreshing in background...');
            try {
              const freshTemplates = await window.AwesomeLMSupabase.fetchTemplates();
              await window.AwesomeLMTemplateCache.set(freshTemplates);
              console.log('[NLM Carousel] Background refresh completed');
            } catch (refreshError) {
              console.warn('[NLM Carousel] Background refresh failed:', refreshError);
            }
          }
        } else {
          console.log('[NLM Carousel] No cache, fetching from Supabase...');
          try {
            const templates = await window.AwesomeLMSupabase.fetchTemplates();
            await window.AwesomeLMTemplateCache.set(templates);
            console.log('[NLM Carousel] Fetched', templates.length, 'templates from Supabase');
            injectCarousel(templates);
          } catch (fetchError) {
            console.error('[NLM Carousel] Supabase fetch failed:', fetchError);
            console.log('[NLM Carousel] Using fallback templates');
            injectCarousel(window.AwesomeLMSupabase.FALLBACK_TEMPLATES);
          }
        }
      } catch (err) {
        console.error('[NLM Carousel] Error loading templates:', err);
        injectCarousel(window.AwesomeLMSupabase.FALLBACK_TEMPLATES);
      }
    }, 200); // Reduced delay since we now wait for Format section properly
  }

  const observer = new MutationObserver(syncToCurrentModal);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  ensureStylesheet();
  window.AwesomeLMNLM.ensureAutomationBridge();
  syncToCurrentModal();
  setInterval(syncToCurrentModal, 1200);
})();
