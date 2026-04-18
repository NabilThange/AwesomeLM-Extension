// NotebookLM Extension - Overlay UI

(function() {
  'use strict';

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof textContent === 'string') {
      element.textContent = textContent;
    }

    return element;
  }

  function truncateText(value, maxLength) {
    if (!value) {
      return '';
    }

    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
  }

  function createOverlayController(config) {
    let modal = null;
    let titleText = null;
    let notice = null;
    let loading = null;
    let list = null;
    let empty = null;
    let previewImage = null;
    let previewTitle = null;
    let previewMeta = null;
    let previewDescription = null;
    let previewPrompt = null;
    let fillButton = null;
    let buildButton = null;
    let formatButtons = [];
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let state = {
      templates: [],
      selectedTemplateId: null,
      format: 'presenter',
      isLoading: false,
      noticeText: '',
      noticeTone: 'info',
      emptyText: 'No templates available yet.',
    };

    function selectedTemplate() {
      return state.templates.find((template) => template.id === state.selectedTemplateId) || null;
    }

    function updatePreview() {
      const template = selectedTemplate();

      if (!template) {
        previewImage.textContent = '';
        previewImage.removeAttribute('style');
        previewImage.className = 'nlm-preview-image nlm-preview-image-placeholder';
        previewTitle.textContent = 'Choose a template';
        previewMeta.hidden = true;
        previewMeta.textContent = '';
        previewDescription.textContent = 'The selected template description will appear here before it fills NotebookLM.';
        previewPrompt.textContent = '';
        fillButton.disabled = true;
        buildButton.disabled = true;
        return;
      }

      previewTitle.textContent = template.title;

      previewMeta.hidden = true;
      previewMeta.textContent = '';
      previewDescription.textContent = truncateText(
        template.description || 'No description available.',
        120,
      );
      previewPrompt.textContent = template.prompt || '';
      fillButton.disabled = false;
      buildButton.disabled = false;

      if (template.imageUrl) {
        previewImage.className = 'nlm-preview-image';
        previewImage.style.backgroundImage = `url("${template.imageUrl}")`;
        previewImage.textContent = '';
      } else {
        previewImage.removeAttribute('style');
        previewImage.className = 'nlm-preview-image nlm-preview-image-placeholder';
        previewImage.textContent = (template.title || '?').slice(0, 1).toUpperCase();
      }
    }

    function renderNotice() {
      if (!state.noticeText) {
        notice.hidden = true;
        notice.textContent = '';
        notice.className = 'nlm-status-banner';
        return;
      }

      notice.hidden = false;
      notice.className = `nlm-status-banner nlm-status-${state.noticeTone || 'info'}`;
      notice.textContent = state.noticeText;
    }

    function renderLoading() {
      loading.hidden = !state.isLoading;
    }

    function renderList() {
      list.textContent = '';
      const hasTemplates = state.templates.length > 0;
      empty.hidden = hasTemplates;

      if (!hasTemplates) {
        empty.textContent = state.emptyText;
        return;
      }

      state.templates.forEach((template) => {
        const card = createElement('button', 'nlm-template-card');
        card.type = 'button';
        card.dataset.templateId = template.id;

        if (template.id === state.selectedTemplateId) {
          card.classList.add('is-selected');
        }

        let thumb;
        if (template.imageUrl) {
          thumb = createElement('div', 'nlm-template-thumb');
          thumb.style.backgroundImage = `url("${template.imageUrl}")`;
        } else {
          thumb = createElement(
            'div',
            'nlm-template-thumb nlm-template-thumb-placeholder',
            (template.title || '?').slice(0, 1).toUpperCase(),
          );
        }

        const content = createElement('div', 'nlm-template-content');
        const heading = createElement('div', 'nlm-template-heading');
        const title = createElement('h3', '', template.title);
        heading.appendChild(title);

        if (template.category) {
          const chip = createElement('span', 'nlm-template-chip', template.category);
          heading.appendChild(chip);
        }

        const description = createElement('p', '', template.description || 'No description available.');
        content.appendChild(heading);
        content.appendChild(description);

        card.appendChild(thumb);
        card.appendChild(content);
        list.appendChild(card);
      });
    }

    function renderFormatButtons() {
      formatButtons.forEach((button) => {
        const isActive = button.dataset.format === state.format;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function render() {
      renderNotice();
      renderLoading();
      renderList();
      renderFormatButtons();
      updatePreview();
      titleText.textContent = `AwesomeLM Template Library${state.templates.length ? ` (${state.templates.length})` : ''}`;
    }

    function setState(patch) {
      state = Object.assign({}, state, patch);

      if (!state.selectedTemplateId && state.templates.length > 0) {
        state.selectedTemplateId = state.templates[0].id;
      }

      if (state.selectedTemplateId && !state.templates.some((template) => template.id === state.selectedTemplateId)) {
        state.selectedTemplateId = state.templates[0] ? state.templates[0].id : null;
      }

      render();
    }

    function build() {
      if (modal) {
        return;
      }

      modal = document.createElement('dialog');
      modal.id = '__nlm-ext-modal';

      const container = createElement('div', 'nlm-modal-container');
      const titlebar = createElement('div', 'nlm-modal-titlebar');
      const circles = createElement('div', 'nlm-circles');
      const closeCircle = createElement('button', 'nlm-circle');
      closeCircle.type = 'button';
      closeCircle.title = 'Close';
      const mutedCircle = createElement('div', 'nlm-circle nlm-circle-muted');
      const mutedCircleTwo = createElement('div', 'nlm-circle nlm-circle-muted-two');
      circles.appendChild(closeCircle);
      circles.appendChild(mutedCircle);
      circles.appendChild(mutedCircleTwo);

      const titlebarMain = createElement('div', 'nlm-titlebar-main');
      titleText = createElement('div', 'nlm-titlebar-title', 'AwesomeLM Template Library');
      titlebarMain.appendChild(titleText);
      titlebar.appendChild(circles);
      titlebar.appendChild(titlebarMain);

      const body = createElement('div', 'nlm-modal-body');
      notice = createElement('div', 'nlm-status-banner');
      notice.hidden = true;
      loading = createElement('div', 'nlm-loading-row');
      loading.hidden = true;
      loading.appendChild(createElement('div', 'nlm-spinner'));
      loading.appendChild(createElement('span', '', 'Loading templates...'));

      const layout = createElement('div', 'nlm-layout');
      const left = createElement('section', 'nlm-pane nlm-pane-list');
      const right = createElement('section', 'nlm-pane nlm-pane-detail');

      list = createElement('div', 'nlm-template-list');
      empty = createElement('div', 'nlm-empty-state', 'No templates available yet.');

      left.appendChild(loading);
      left.appendChild(list);
      left.appendChild(empty);

      previewImage = createElement('div', 'nlm-preview-image nlm-preview-image-placeholder', 'T');
      previewTitle = createElement('h3', 'nlm-preview-title', 'Choose a template');
      previewMeta = createElement('p', 'nlm-preview-meta', '');
      previewMeta.hidden = true;
      previewDescription = createElement(
        'p',
        'nlm-preview-description',
        'The selected template description will appear here before it fills NotebookLM.',
      );
      previewPrompt = createElement('pre', 'nlm-prompt-preview', '');

      const formatSection = createElement('div', 'nlm-detail-section');
      formatSection.appendChild(createElement('h4', '', 'Format'));
      const formatGroup = createElement('div', 'nlm-format-toggle');
      ['presenter', 'detailed'].forEach((format) => {
        const button = createElement(
          'button',
          'nlm-format-btn',
          format === 'presenter' ? 'Presenter Slides' : 'Detailed Deck',
        );
        button.type = 'button';
        button.dataset.format = format;
        formatButtons.push(button);
        formatGroup.appendChild(button);
      });
      formatSection.appendChild(formatGroup);

      const actionRow = createElement('div', 'nlm-action-row');
      fillButton = createElement('button', 'nlm-secondary-btn', 'Fill');
      fillButton.type = 'button';
      buildButton = createElement('button', 'nlm-primary-btn', 'Build');
      buildButton.type = 'button';
      actionRow.appendChild(fillButton);
      actionRow.appendChild(buildButton);

      right.appendChild(previewImage);
      right.appendChild(previewTitle);
      right.appendChild(previewMeta);
      right.appendChild(previewDescription);
      right.appendChild(formatSection);
      right.appendChild(createElement('h4', 'nlm-detail-heading', 'Prompt'));
      right.appendChild(previewPrompt);
      right.appendChild(actionRow);

      layout.appendChild(left);
      layout.appendChild(right);

      body.appendChild(notice);
      body.appendChild(layout);
      container.appendChild(titlebar);
      container.appendChild(body);
      modal.appendChild(container);
      document.body.appendChild(modal);

      closeCircle.addEventListener('click', () => modal.close());
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.close();
        }
      });

      list.addEventListener('click', (event) => {
        const card = event.target.closest('.nlm-template-card');
        if (!card) {
          return;
        }

        setState({
          selectedTemplateId: card.dataset.templateId,
        });
      });

      formatGroup.addEventListener('click', (event) => {
        const button = event.target.closest('.nlm-format-btn');
        if (!button) {
          return;
        }

        setState({
          format: button.dataset.format,
        });
      });

      fillButton.addEventListener('click', () => {
        const template = selectedTemplate();
        if (!template) {
          return;
        }

        config.onFill({
          template,
          format: state.format,
          length: 'default',
        });
      });

      buildButton.addEventListener('click', () => {
        const template = selectedTemplate();
        if (!template) {
          return;
        }

        config.onBuild({
          template,
          format: state.format,
          length: 'default',
        });

        setState({
          noticeText: `Building "${template.title}" - filling and generating...`,
          noticeTone: 'success',
        });
        setTimeout(() => modal.close(), 250);
      });

      titlebar.addEventListener('mousedown', (event) => {
        if (event.target.closest('button')) {
          return;
        }

        dragging = true;
        const rect = modal.getBoundingClientRect();
        dragOffsetX = event.clientX - rect.left;
        dragOffsetY = event.clientY - rect.top;
        event.preventDefault();
      });

      document.addEventListener('mousemove', (event) => {
        if (!dragging || !modal.open) {
          return;
        }

        let leftPos = event.clientX - dragOffsetX;
        let topPos = event.clientY - dragOffsetY;
        const maxLeft = window.innerWidth - modal.offsetWidth;
        const maxTop = window.innerHeight - modal.offsetHeight;
        leftPos = Math.max(0, Math.min(leftPos, maxLeft));
        topPos = Math.max(0, Math.min(topPos, maxTop));
        modal.style.left = `${leftPos}px`;
        modal.style.top = `${topPos}px`;
        modal.style.margin = '0';
      });

      document.addEventListener('mouseup', () => {
        dragging = false;
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.open) {
          modal.close();
        }
      });

      render();
    }

    return {
      open() {
        build();
        if (!modal.open) {
          modal.showModal();
        }
      },
      close() {
        if (modal && modal.open) {
          modal.close();
        }
      },
      setTemplates(templates, options) {
        setState({
          templates,
          selectedTemplateId: options && options.keepSelection ? state.selectedTemplateId : null,
          isLoading: false,
          noticeText: options && options.noticeText ? options.noticeText : '',
          noticeTone: options && options.noticeTone ? options.noticeTone : 'info',
          emptyText: options && options.emptyText ? options.emptyText : 'No templates available yet.',
        });
      },
      setLoading(message, templates) {
        setState({
          templates: Array.isArray(templates) ? templates : state.templates,
          isLoading: true,
          noticeText: message || '',
          noticeTone: 'info',
          emptyText: 'Loading templates...',
        });
      },
      setNotice(message, tone) {
        setState({
          noticeText: message || '',
          noticeTone: tone || 'info',
        });
      },
    };
  }

  window.AwesomeLMTemplateOverlay = {
    create: createOverlayController,
  };
})();
