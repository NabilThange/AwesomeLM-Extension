# Architecture Overview

## Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Chrome Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌─────────────────────────────┐  │
│  │   popup.html │         │   NotebookLM Website        │  │
│  │   popup.js   │         │   (notebooklm.google.com)   │  │
│  └──────────────┘         └─────────────────────────────┘  │
│        │                              │                      │
│        │                              ▼                      │
│        │                   ┌──────────────────────┐         │
│        │                   │  content_inject.js   │         │
│        │                   │  (Content Script)    │         │
│        │                   └──────────────────────┘         │
│        │                              │                      │
│        │                              │ Detects Modal        │
│        │                              │ Injects Icon         │
│        │                              ▼                      │
│        │                   ┌──────────────────────┐         │
│        │                   │   📋 Template Icon   │         │
│        │                   │   (Floating Button)  │         │
│        │                   └──────────────────────┘         │
│        │                              │                      │
│        │                              │ Click                │
│        │                              ▼                      │
│        │                   ┌──────────────────────┐         │
│        │                   │    overlay.js        │         │
│        │                   │    overlay.css       │         │
│        │                   │  (Template Library)  │         │
│        │                   └──────────────────────┘         │
│        │                              │                      │
│        │                              │ Select Template      │
│        │                              │ Click "Build It"     │
│        │                              ▼                      │
│        │                   ┌──────────────────────┐         │
│        │                   │   automation.js      │         │
│        │                   │  (Page Context)      │         │
│        │                   └──────────────────────┘         │
│        │                              │                      │
│        │                              │ Fills Form           │
│        │                              ▼                      │
│        │                   ┌──────────────────────┐         │
│        │                   │  NotebookLM Modal    │         │
│        │                   │  ✓ Format Set        │         │
│        │                   │  ✓ Length Set        │         │
│        │                   │  ✓ Prompt Filled     │         │
│        │                   └──────────────────────┘         │
│        │                                                     │
│        └─────────────────────────────────────────────────── │
│                     background.js                            │
│                  (Service Worker)                            │
└─────────────────────────────────────────────────────────────┘
```

## File Responsibilities

### Core Extension Files

**manifest.json**
- Extension configuration
- Permissions and host access
- Content script registration
- Web accessible resources

**background.js**
- Service worker (runs in background)
- Handles extension lifecycle
- Message passing hub

### User Interface

**popup.html + popup.js**
- Extension toolbar popup
- Shows status and instructions
- Validates current page

### Content Injection

**content_inject.js**
- Runs on NotebookLM pages
- Watches for "Customize Slide Deck" modal
- Injects template icon button
- Loads overlay on demand

### Template Library

**overlay.js**
- Draggable modal UI
- Template list and detail views
- Template selection logic
- Triggers automation

**overlay.css**
- Overlay styling
- Animations and transitions
- Responsive layout

### Automation

**automation.js**
- Runs in page context (not isolated)
- Interacts with Angular components
- Fills form fields
- Triggers Angular change detection

### Assets

**icon.svg**
- Template library icon (SVG)
- Used in overlay button

**icons/*.png**
- Extension icons (16, 32, 48, 128)
- Shown in Chrome UI

## Execution Contexts

### 1. Extension Context (Isolated)
- `popup.js`
- `background.js`
- Has access to Chrome APIs
- Cannot access page JavaScript

### 2. Content Script Context (Isolated)
- `content_inject.js`
- Can read/modify DOM
- Cannot access page JavaScript
- Can use Chrome APIs (limited)

### 3. Page Context (Shared)
- `automation.js`
- Injected via `<script>` tag
- Full access to page JavaScript
- Can interact with Angular/React
- No Chrome API access

## Data Flow

### Template Selection Flow

```
User clicks template
    ↓
overlay.js captures click
    ↓
Injects automation.js into page
    ↓
Passes template data via window global
    ↓
automation.js reads data
    ↓
Fills NotebookLM form fields
    ↓
Triggers Angular events
    ↓
Form updates complete
```

### Modal Detection Flow

```
Page loads
    ↓
content_inject.js starts MutationObserver
    ↓
User clicks "Customize Slide Deck"
    ↓
Modal appears in DOM
    ↓
Observer detects textarea
    ↓
Injects icon button
    ↓
User clicks icon
    ↓
Loads overlay.js + overlay.css
```

## Security Model

### Content Security Policy
- Extension runs in isolated world
- Cannot directly access page variables
- Uses message passing for communication

### Injection Strategy
- Content scripts: Auto-injected by manifest
- Overlay: Injected on-demand via chrome.runtime.getURL()
- Automation: Injected as `<script>` for page access

### Permissions
- `activeTab`: Access current tab
- `scripting`: Inject scripts dynamically
- `host_permissions`: Run on notebooklm.google.com

## Key Technical Decisions

### Why MutationObserver?
NotebookLM is a SPA (Single Page App). The modal doesn't exist on page load—it's created dynamically. MutationObserver watches for DOM changes and detects when the modal appears.

### Why Separate automation.js?
Angular's reactive forms require triggering specific events. Content scripts run in an isolated context and can't access Angular's internals. We inject `automation.js` into the page context to interact with Angular directly.

### Why Draggable Modal?
Users may need to reference other parts of the page while selecting templates. A draggable modal provides flexibility without blocking the view.

### Why Template Library?
Instead of a simple dropdown, a visual library with descriptions helps users understand what each template does before applying it.

## Extension Lifecycle

### Installation
1. User loads unpacked extension
2. `background.js` service worker starts
3. Extension icon appears in toolbar

### Page Visit
1. User navigates to notebooklm.google.com
2. `content_inject.js` auto-injects
3. Starts watching for modal

### Modal Open
1. User clicks "Customize Slide Deck"
2. Modal appears with textarea
3. Icon button injected
4. Ready for interaction

### Template Application
1. User clicks icon → overlay loads
2. User selects template → detail view
3. User clicks "Build It" → automation runs
4. Form fills automatically
5. User clicks "Generate"

## Performance Considerations

### Lazy Loading
- Overlay only loads when icon is clicked
- Automation only loads when template is selected
- Minimizes initial page load impact

### DOM Observation
- MutationObserver is throttled
- Only observes when modal might appear
- Disconnects when not needed

### Memory Management
- Overlay reuses same DOM element
- Scripts clean up after execution
- Event listeners properly removed

## Debugging Tips

### Check Content Script
```javascript
// In browser console on NotebookLM
console.log('[NLM Extension] Content script loaded');
```

### Check Overlay
```javascript
// After clicking icon
console.log(window.__nlmOverlayLoaded);
console.log(window.__nlmShowOverlay);
```

### Check Automation
```javascript
// After clicking "Build It"
console.log(window.__nlmAutomateSlide);
```

### Chrome DevTools
- F12 → Console: See all logs
- F12 → Elements: Inspect injected elements
- F12 → Network: Check resource loading
- chrome://extensions → Inspect views: Debug popup/background

## Future Enhancements

Possible improvements:
- [ ] Template import/export
- [ ] Custom template editor
- [ ] Template categories/tags
- [ ] Keyboard shortcuts
- [ ] Template preview
- [ ] Cloud sync for templates
- [ ] Analytics/usage tracking
- [ ] Multi-language support
