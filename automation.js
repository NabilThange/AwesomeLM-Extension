// NotebookLM Extension - Automation Script
// Runs in page context to interact with Angular components.

(function() {
  'use strict';

  if (window.__nlmAutomateSlide) {
    return;
  }

  const AUTOMATION_MESSAGE_TYPE = 'AWESOMELM_NLM_AUTOMATE';
  const TEMPLATE_SELECTED_TYPE = 'AWESOMELM_TEMPLATE_SELECTED';
  const TEXTAREA_SELECTOR = 'textarea[cdkautosizeminrows="1"][cdkautosizemaxrows="10"]';
  
  // Store selected template in page context
  let selectedTemplate = null;

  // Listen for template selection messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) {
      return;
    }

    // Handle template selection
    if (event.data && event.data.type === TEMPLATE_SELECTED_TYPE) {
      selectedTemplate = event.data.template;
      console.log('[NLM Automation] Template received in page context:', selectedTemplate.title);
      return;
    }

    // Handle automation messages
    if (event.data && event.data.type === AUTOMATION_MESSAGE_TYPE) {
      automateSlideModal(event.data.payload || {});
    }
  });

  // Intercept Enter key in textarea to combine prompts and auto-generate
  function interceptTextareaEnter() {
    // Use event delegation since textarea might be dynamically created
    document.addEventListener('keydown', function(event) {
      const textarea = event.target.closest(TEXTAREA_SELECTOR);
      if (!textarea) return;
      
      // Only intercept Enter (not Shift+Enter for newlines)
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('[NLM Automation] Enter pressed - combining prompts and auto-generating...');
        
        // Get user's typed prompt
        const userPrompt = textarea.value.trim();
        
        let finalPrompt = userPrompt;
        
        if (selectedTemplate && selectedTemplate.prompt) {
          // Combine prompts
          if (userPrompt) {
            finalPrompt = `${userPrompt}\n\n${selectedTemplate.prompt}`;
            console.log('[NLM Automation] Combining user + template prompt');
          } else {
            finalPrompt = selectedTemplate.prompt;
            console.log('[NLM Automation] Using template prompt only');
          }
          
          // Update textarea with combined prompt
          const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
          if (nativeSetter && nativeSetter.set) {
            nativeSetter.set.call(textarea, finalPrompt);
          }
          
          // Trigger Angular change detection
          ['input', 'change', 'keyup'].forEach((eventType) => {
            textarea.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          textarea.dispatchEvent(new InputEvent('input', { bubbles: true, data: finalPrompt }));
          
          console.log('[NLM Automation] ✅ Combined prompt set:', finalPrompt.substring(0, 100) + '...');
        } else {
          console.log('[NLM Automation] No template selected, using user prompt as-is');
        }
        
        // Auto-click Generate button after a short delay
        setTimeout(() => {
          const generateButton = Array.from(document.querySelectorAll('button')).find((button) =>
            button.textContent && button.textContent.trim() === 'Generate',
          );
          
          if (generateButton && !generateButton.disabled) {
            console.log('[NLM Automation] ✅ Auto-clicking Generate button');
            generateButton.click();
          } else {
            console.warn('[NLM Automation] Generate button not found or disabled');
          }
        }, 100);
      }
    }, true); // Use capture phase to intercept before other handlers
  }

  // Intercept Generate button clicks to combine prompts (fallback for manual clicks)
  function interceptGenerateButton() {
    // Use event delegation to catch Generate button clicks
    document.addEventListener('click', function(event) {
      const button = event.target.closest('button');
      if (!button) return;
      
      const buttonText = button.textContent?.trim();
      if (buttonText === 'Generate') {
        console.log('[NLM Automation] Generate button clicked - intercepting...');
        
        // Get the textarea
        const textarea = document.querySelector(TEXTAREA_SELECTOR);
        if (!textarea) {
          console.warn('[NLM Automation] Textarea not found during Generate click');
          return;
        }
        
        // Get user's current input
        const userPrompt = textarea.value.trim();
        
        if (selectedTemplate && selectedTemplate.prompt) {
          // Combine prompts
          let finalPrompt;
          if (userPrompt) {
            finalPrompt = `${userPrompt}\n\n${selectedTemplate.prompt}`;
            console.log('[NLM Automation] Combining user + template prompt');
          } else {
            finalPrompt = selectedTemplate.prompt;
            console.log('[NLM Automation] Using template prompt only');
          }
          
          // Update textarea with combined prompt
          const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
          if (nativeSetter && nativeSetter.set) {
            nativeSetter.set.call(textarea, finalPrompt);
          }
          
          // Trigger events to notify Angular
          ['input', 'change', 'keyup'].forEach((eventType) => {
            textarea.dispatchEvent(new Event(eventType, { bubbles: true }));
          });
          textarea.dispatchEvent(new InputEvent('input', { bubbles: true, data: finalPrompt }));
          
          console.log('[NLM Automation] ✅ Combined prompt set:', finalPrompt.substring(0, 100) + '...');
        } else {
          console.log('[NLM Automation] No template selected, using user prompt as-is');
        }
        
        // Let the original Generate button click proceed
      }
    }, true); // Use capture phase to intercept before other handlers
  }

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

  // Initialize both Enter key and Generate button interception
  interceptTextareaEnter();
  interceptGenerateButton();

  window.__nlmAutomateSlide = automateSlideModal;
})();
