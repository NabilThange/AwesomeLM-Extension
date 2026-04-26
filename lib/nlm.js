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

  function createCarousel(templates, onSelect) {
    function mk(tag, cls, txt) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt !== undefined) e.textContent = txt;
      return e;
    }

    function checkSVG() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 12 12');
      svg.style.cssText = 'width:11px;height:11px;display:block;';
      const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      pl.setAttribute('points', '2,6 5,9 10,3');
      pl.setAttribute('fill', 'none');
      pl.setAttribute('stroke', '#202124');
      pl.setAttribute('stroke-width', '2.5');
      pl.setAttribute('stroke-linecap', 'round');
      pl.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(pl);
      return svg;
    }

    const root = mk('div');
    root.id = 'nlm-carousel-v21';

    const header = mk('div', 'c21-header');
    header.appendChild(mk('div', 'c21-title', `Quick start templates (${templates.length})`));

    const nav = mk('div', 'c21-nav');
    const prev = mk('button', 'c21-btn', '‹');
    prev.type = 'button';
    const next = mk('button', 'c21-btn', '›');
    next.type = 'button';
    nav.append(prev, next);
    header.appendChild(nav);

    const wrap = mk('div', 'c21-wrap');
    const track = mk('div', 'c21-track');

    let selId = templates[0]?.id;

    templates.forEach((t) => {
      const card = mk('div', 'c21-card' + (t.id === selId ? ' sel' : ''));
      card.dataset.id = t.id;

      const thumb = mk('div', 'c21-thumb');
      const img = document.createElement('img');
      img.src = t.imageUrl || chrome.runtime.getURL('icons/icon128.png');
      img.alt = t.title;
      img.loading = 'lazy';
      thumb.appendChild(img);

      const chk = mk('div', 'c21-check');
      chk.appendChild(checkSVG());
      thumb.appendChild(chk);

      card.append(thumb, mk('div', 'c21-lbl', t.title));
      track.appendChild(card);
    });

    wrap.appendChild(track);
    root.append(header, wrap);

    // Scroll buttons
    const scrollAmount = 152;
    prev.addEventListener('click', () => wrap.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    next.addEventListener('click', () => wrap.scrollBy({ left: scrollAmount, behavior: 'smooth' }));

    // Selection - store template and send to page context
    track.addEventListener('click', (e) => {
      const card = e.target.closest('.c21-card');
      if (!card) return;

      selId = card.dataset.id;
      const template = templates.find((x) => x.id === selId);

      track.querySelectorAll('.c21-card').forEach((c) => c.classList.remove('sel'));
      card.classList.add('sel');

      // Store selected template in content script context
      if (template) {
        window.__selectedAwesomeLMTemplate = template;
        console.log('[NLM Carousel] Template selected:', template.title);
        
        // Send template to page context via postMessage
        window.postMessage(
          {
            type: 'AWESOMELM_TEMPLATE_SELECTED',
            template: template,
          },
          '*'
        );
      }

      if (onSelect && template) {
        onSelect(template);
      }
    });

    return root;
  }

  window.AwesomeLMNLM = {
    TEXTAREA_SELECTOR,
    MODAL_SELECTOR,
    createIconGraphic,
    ensureAutomationBridge,
    fillTemplate,
    findModalContext,
    createCarousel,
  };
})();
