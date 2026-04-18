// NotebookLM Extension - Automation Script
// Runs in page context to interact with Angular components.

(function() {
  'use strict';

  if (window.__nlmAutomateSlide) {
    return;
  }

  const AUTOMATION_MESSAGE_TYPE = 'AWESOMELM_NLM_AUTOMATE';

  function automateSlideModal({
    format = 'presenter',
    length = 'default',
    prompt = '',
    autoGenerate = false,
  } = {}) {
    console.log('[NLM Automation] Starting automation...', { format, length });

    const allEls = Array.from(document.querySelectorAll('*'));
    const keyword = format === 'presenter' ? 'Presenter Slides' : 'Detailed Deck';
    const textEl = allEls.find((element) =>
      element.children.length === 0 && element.textContent && element.textContent.trim() === keyword,
    );

    if (textEl) {
      let current = textEl;
      for (let index = 0; index < 6; index += 1) {
        current = current && current.parentElement;
        if (current && current.tagName === 'LABEL') {
          current.click();
          break;
        }
      }
    }

    setTimeout(() => {
      const toggleButtons = Array.from(document.querySelectorAll('button.mat-button-toggle-button'));
      const lengthButton = toggleButtons.find((button) =>
        button.textContent && button.textContent.trim().toLowerCase() === length,
      );

      if (lengthButton) {
        lengthButton.click();
      }
    }, 100);

    setTimeout(() => {
      const textarea = document.querySelector('textarea[cdkautosizeminrows="1"][cdkautosizemaxrows="10"]');
      if (!textarea) {
        console.warn('[NLM Automation] Prompt textarea not found');
        return;
      }

      textarea.focus();

      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
      if (nativeSetter && nativeSetter.set) {
        nativeSetter.set.call(textarea, prompt);
      }

      ['input', 'change', 'keyup'].forEach((eventType) => {
        textarea.dispatchEvent(new Event(eventType, { bubbles: true }));
      });
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, data: prompt }));
    }, 200);

    if (autoGenerate) {
      setTimeout(() => {
        const generateButton = Array.from(document.querySelectorAll('button')).find((button) =>
          button.textContent && button.textContent.trim() === 'Generate',
        );

        if (generateButton && !generateButton.disabled) {
          generateButton.click();
        }
      }, 500);
    }
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) {
      return;
    }

    if (!event.data || event.data.type !== AUTOMATION_MESSAGE_TYPE) {
      return;
    }

    automateSlideModal(event.data.payload || {});
  });

  window.__nlmAutomateSlide = automateSlideModal;
})();
