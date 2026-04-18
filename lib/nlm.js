// NotebookLM Extension - NotebookLM Integration Helpers

(function() {
  'use strict';

  const TEXTAREA_SELECTOR = 'textarea[cdkautosizeminrows="1"][cdkautosizemaxrows="10"]';
  const MODAL_SELECTOR = 'mat-dialog-container, .mat-mdc-dialog-container, [role="dialog"]';
  const AUTOMATION_SCRIPT_ID = '__nlm-automation-script';
  const AUTOMATION_MESSAGE_TYPE = 'AWESOMELM_NLM_AUTOMATE';

  function findModalContext() {
    const textarea = document.querySelector(TEXTAREA_SELECTOR);

    if (!textarea) {
      return null;
    }

    const modal = textarea.closest(MODAL_SELECTOR) || textarea.parentElement;

    return {
      textarea,
      modal,
      container: textarea.parentElement,
    };
  }

  function createIconGraphic() {
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('icons/icon32.png');
    img.width = 20;
    img.height = 20;
    img.style.display = 'block';
    img.setAttribute('aria-hidden', 'true');
    return img;
  }

  function ensureAutomationBridge() {
    if (document.getElementById(AUTOMATION_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = AUTOMATION_SCRIPT_ID;
    script.src = chrome.runtime.getURL('automation.js');
    document.head.appendChild(script);
  }

  function fillTemplate(payload) {
    ensureAutomationBridge();
    window.postMessage(
      {
        type: AUTOMATION_MESSAGE_TYPE,
        payload: {
          format: payload.format,
          length: payload.length,
          prompt: payload.prompt,
          autoGenerate: payload.autoGenerate || false,
        },
      },
      '*',
    );
  }

  window.AwesomeLMNLM = {
    TEXTAREA_SELECTOR,
    MODAL_SELECTOR,
    createIconGraphic,
    ensureAutomationBridge,
    fillTemplate,
    findModalContext,
  };
})();
