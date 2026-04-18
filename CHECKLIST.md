# Installation & Testing Checklist

## Pre-Installation

- [ ] All files are in the `notebooklm-extension` folder
- [ ] `manifest.json` exists and is valid JSON
- [ ] All JavaScript files are present (7 files)
- [ ] CSS file exists (`overlay.css`)
- [ ] HTML files exist (`popup.html`, `generate-icons.html`)

## Icon Generation

- [ ] Open `generate-icons.html` in browser
- [ ] Download `icon16.png`
- [ ] Download `icon32.png`
- [ ] Download `icon48.png`
- [ ] Download `icon128.png`
- [ ] Move all 4 PNG files to `icons/` folder
- [ ] Verify icons folder contains 4 PNG files

## Chrome Extension Installation

- [ ] Open Chrome browser
- [ ] Navigate to `chrome://extensions`
- [ ] Enable "Developer mode" toggle (top-right)
- [ ] Click "Load unpacked" button
- [ ] Select `notebooklm-extension` folder
- [ ] Extension appears in list without errors
- [ ] Extension icon visible in toolbar

## Basic Functionality Test

- [ ] Navigate to https://notebooklm.google.com
- [ ] Open any notebook (or create one)
- [ ] Click "Customize Slide Deck" button
- [ ] Wait 1-2 seconds for modal to load
- [ ] 📋 Icon appears in bottom-right of text area
- [ ] Icon has hover effect (opacity changes)

## Template Library Test

- [ ] Click the 📋 icon
- [ ] Template library overlay appears
- [ ] Overlay is centered on screen
- [ ] 3 templates are visible:
  - [ ] 📚 Beginner-Friendly Deck
  - [ ] 💼 Executive Summary
  - [ ] ⚙️ Technical Deep Dive
- [ ] Each template has icon, title, description, arrow
- [ ] Hover effect works on template cards

## Dragging Test

- [ ] Click and hold on overlay titlebar
- [ ] Drag overlay to different position
- [ ] Overlay moves smoothly
- [ ] Overlay stays within viewport bounds
- [ ] Release mouse - overlay stays in position

## Template Detail Test

- [ ] Click on first template card
- [ ] Detail view appears
- [ ] Back button is visible
- [ ] Template icon and title shown
- [ ] Format section shows correct value
- [ ] Length section shows correct value
- [ ] Prompt preview is visible and readable
- [ ] "Build It" button is visible

## Navigation Test

- [ ] Click "Back" button
- [ ] Returns to template list
- [ ] Click different template
- [ ] Detail view updates correctly
- [ ] Click "Back" again
- [ ] Returns to list

## Automation Test

- [ ] Open template detail view
- [ ] Click "✨ Build It" button
- [ ] Overlay closes automatically
- [ ] Format radio button is selected correctly
- [ ] Length toggle is set correctly
- [ ] Prompt textarea is filled with template text
- [ ] Text is visible and complete

## Close Functionality Test

- [ ] Open template library
- [ ] Click X button (top-right)
- [ ] Overlay closes smoothly
- [ ] Open library again
- [ ] Press Escape key
- [ ] Overlay closes

## Popup Test

- [ ] Click extension icon in toolbar
- [ ] Popup opens
- [ ] Shows "Extension is active" message (if on NotebookLM)
- [ ] Shows instructions
- [ ] Shows version number

## Console Check

- [ ] Open Chrome DevTools (F12)
- [ ] Go to Console tab
- [ ] Look for extension logs:
  - [ ] `[NLM Extension] Content script loaded`
  - [ ] `[NLM Extension] Modal detected, injecting icon...`
  - [ ] `[NLM Extension] Icon injected successfully`
  - [ ] `[NLM Extension] Overlay built` (after clicking icon)
  - [ ] `[NLM Automation] Starting automation...` (after Build It)
- [ ] No error messages in red

## Edge Cases

- [ ] Close modal and reopen - icon reappears
- [ ] Refresh page - extension still works
- [ ] Open multiple notebooks - works in each
- [ ] Click icon multiple times - no duplicates
- [ ] Click Build It multiple times - no errors

## Cross-Browser Test (Optional)

- [ ] Test in Microsoft Edge (should work)
- [ ] Test in Chrome Canary (should work)
- [ ] Note: Firefox/Safari require different manifest

## Performance Check

- [ ] Page loads normally (no slowdown)
- [ ] Icon appears within 2 seconds
- [ ] Overlay opens instantly
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks (check Task Manager)

## Cleanup Test

- [ ] Disable extension in chrome://extensions
- [ ] Refresh NotebookLM page
- [ ] Icon no longer appears
- [ ] No console errors
- [ ] Re-enable extension
- [ ] Icon reappears after refresh

## Final Verification

- [ ] All features work as expected
- [ ] No console errors
- [ ] No visual glitches
- [ ] Smooth user experience
- [ ] Ready for use!

---

## Troubleshooting

### Icon doesn't appear
1. Check console for errors
2. Verify modal is fully loaded (wait 2-3 seconds)
3. Check textarea selector in DevTools
4. Refresh page and try again

### Overlay doesn't open
1. Check console for script loading errors
2. Verify `overlay.js` and `overlay.css` in web_accessible_resources
3. Check for CSP errors in console
4. Try reloading extension

### Automation doesn't work
1. Check console for automation script errors
2. Verify textarea is focused
3. Check Angular event dispatching
4. Try different template

### Extension won't load
1. Verify all icon files exist
2. Check manifest.json syntax
3. Look for errors in chrome://extensions
4. Try removing and re-adding extension

---

## Success Criteria

✅ Extension loads without errors
✅ Icon appears when modal opens
✅ Template library is functional
✅ Dragging works smoothly
✅ Templates apply correctly
✅ No console errors
✅ Good user experience

**If all checkboxes are checked, you're ready to go! 🎉**
