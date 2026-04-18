# Z-Index Solution: Native `<dialog>` Element

## The Problem
Google's NotebookLM modal uses Angular CDK overlays with their own stacking context. No matter how high we set our z-index (even `2147483647`), our modal would appear behind Google's modal because:

1. Google's modal is inside `.cdk-overlay-container` which creates a stacking context
2. DOM order and stacking contexts matter more than z-index values
3. CSS `transform` properties create new stacking contexts that trap elements

## Failed Approaches
1. ❌ Using extremely high z-index (`999999999`)
2. ❌ Removing `transform` and using margin-based centering
3. ❌ Appending modal to end of `document.body`
4. ❌ Moving modal inside `.cdk-overlay-container`
5. ❌ Lowering Google's backdrop z-index

## The Solution: Native `<dialog>` Element

The **native HTML `<dialog>` element** with `.showModal()` uses the browser's **top layer**, which:
- Sits above ALL other content, regardless of z-index
- Bypasses ALL stacking contexts
- Is a browser primitive that beats even extension overlays
- Provides built-in backdrop and ESC key handling

### Implementation

```javascript
// Create dialog instead of div
const modal = document.createElement('dialog');
modal.id = '__nlm-ext-modal';

// Append to body
document.body.appendChild(modal);

// Show using showModal() - this puts it in the TOP LAYER
modal.showModal();

// Close
modal.close();
```

### Key Benefits
1. **No z-index needed** - top layer is above everything
2. **Built-in backdrop** - `::backdrop` pseudo-element
3. **ESC key handling** - native browser behavior
4. **Click outside to close** - easy to implement
5. **Accessibility** - proper focus management

### CSS Changes
- No `position: fixed` needed
- No `z-index` needed
- Style the `::backdrop` pseudo-element for overlay effect
- Use inner container for actual modal styling

## References
- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN: Top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)
- Browser support: Chrome 37+, Edge 79+, Firefox 98+, Safari 15.4+
