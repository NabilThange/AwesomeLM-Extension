// NotebookLM Extension - Content Script
// Detects the slide deck modal, injects a trigger, and manages the template picker.

(function() {
  'use strict';

  if (!window.location.hostname.includes('notebooklm.google.com')) {
    return;
  }

  const TRIGGER_ID = '__nlm-ext-icon';
  const STYLESHEET_ID = '__nlm-ext-overlay-css';
  let overlayController = null;

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

  function syncToCurrentModal() {
    const context = window.AwesomeLMNLM.findModalContext();

    if (!context || !context.modal) {
      removeTrigger();
      return;
    }

    injectTrigger(context);
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
