# Visual Guide

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User opens NotebookLM                               │
│ https://notebooklm.google.com                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: User clicks "Customize Slide Deck"                  │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │  Customize your slide deck                 │            │
│  │  ┌──────────────────────────────────────┐  │            │
│  │  │ ○ Presenter Slides                   │  │            │
│  │  │ ○ Detailed Deck                      │  │            │
│  │  └──────────────────────────────────────┘  │            │
│  │                                             │            │
│  │  Length: [Default] [Short]                 │            │
│  │                                             │            │
│  │  ┌──────────────────────────────────────┐  │            │
│  │  │ Add a high-level outline...          │  │            │
│  │  │                                       │  │            │
│  │  │                                  📋   │  │  ← ICON!   │
│  │  └──────────────────────────────────────┘  │            │
│  │                                             │            │
│  │                    [Generate]               │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: User clicks the 📋 icon                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Template Library Opens (Draggable)                  │
│                                                              │
│  ╔═══════════════════════════════════════════════╗         │
│  ║ 📋 Template Library                      [×]  ║         │
│  ╠═══════════════════════════════════════════════╣         │
│  ║                                               ║         │
│  ║  ┌─────────────────────────────────────────┐ ║         │
│  ║  │ 📚  Beginner-Friendly Deck          →  │ ║         │
│  ║  │     Perfect for introducing new         │ ║         │
│  ║  │     concepts with clear explanations    │ ║         │
│  ║  └─────────────────────────────────────────┘ ║         │
│  ║                                               ║         │
│  ║  ┌─────────────────────────────────────────┐ ║         │
│  ║  │ 💼  Executive Summary               →  │ ║         │
│  ║  │     High-level overview focused on      │ ║         │
│  ║  │     key insights and recommendations    │ ║         │
│  ║  └─────────────────────────────────────────┘ ║         │
│  ║                                               ║         │
│  ║  ┌─────────────────────────────────────────┐ ║         │
│  ║  │ ⚙️  Technical Deep Dive             →  │ ║         │
│  ║  │     Comprehensive technical             │ ║         │
│  ║  │     presentation with details           │ ║         │
│  ║  └─────────────────────────────────────────┘ ║         │
│  ║                                               ║         │
│  ╚═══════════════════════════════════════════════╝         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: User clicks a template to see details               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: Template Details View                               │
│                                                              │
│  ╔═══════════════════════════════════════════════╗         │
│  ║ 📋 Template Library                      [×]  ║         │
│  ╠═══════════════════════════════════════════════╣         │
│  ║                                               ║         │
│  ║  [← Back]                                     ║         │
│  ║                                               ║         │
│  ║  📚 Beginner-Friendly Deck                    ║         │
│  ║                                               ║         │
│  ║  Perfect for introducing new concepts with    ║         │
│  ║  clear explanations and visual aids           ║         │
│  ║                                               ║         │
│  ║  FORMAT                                       ║         │
│  ║  Presenter Slides                             ║         │
│  ║                                               ║         │
│  ║  LENGTH                                       ║         │
│  ║  Default                                      ║         │
│  ║                                               ║         │
│  ║  PROMPT                                       ║         │
│  ║  ┌─────────────────────────────────────────┐ ║         │
│  ║  │ Create a beginner-friendly              │ ║         │
│  ║  │ presentation with:                      │ ║         │
│  ║  │ - Clear, simple language                │ ║         │
│  ║  │ - Step-by-step explanations             │ ║         │
│  ║  │ - Bold visuals and diagrams             │ ║         │
│  ║  │ ...                                     │ ║         │
│  ║  └─────────────────────────────────────────┘ ║         │
│  ║                                               ║         │
│  ║  ┌───────────────────────────────────────┐   ║         │
│  ║  │      ✨ Build It                      │   ║         │
│  ║  └───────────────────────────────────────┘   ║         │
│  ║                                               ║         │
│  ╚═══════════════════════════════════════════════╝         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 7: User clicks "Build It" - Automation Runs!           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 8: Form Auto-Fills                                     │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │  Customize your slide deck                 │            │
│  │  ┌──────────────────────────────────────┐  │            │
│  │  │ ● Presenter Slides          ← SET!   │  │            │
│  │  │ ○ Detailed Deck                      │  │            │
│  │  └──────────────────────────────────────┘  │            │
│  │                                             │            │
│  │  Length: [●Default] [Short]    ← SET!      │            │
│  │                                             │            │
│  │  ┌──────────────────────────────────────┐  │            │
│  │  │ Create a beginner-friendly           │  │            │
│  │  │ presentation with:                   │  │            │
│  │  │ - Clear, simple language             │  │  ← FILLED! │
│  │  │ - Step-by-step explanations          │  │            │
│  │  │ - Bold visuals and diagrams          │  │            │
│  │  └──────────────────────────────────────┘  │            │
│  │                                             │            │
│  │                    [Generate]               │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 9: User clicks "Generate" - Done! 🎉                   │
└─────────────────────────────────────────────────────────────┘
```

## UI Components

### Icon Button (Injected)
```
┌──────────────────────────────────────┐
│ Add a high-level outline...          │
│                                       │
│                                  ┌──┐ │
│                                  │📋│ │ ← Floating button
│                                  └──┘ │    (bottom-right)
└──────────────────────────────────────┘
```

### Template Card (List View)
```
┌─────────────────────────────────────────┐
│  📚  Beginner-Friendly Deck          →  │
│      Perfect for introducing new        │
│      concepts with clear explanations   │
└─────────────────────────────────────────┘
     ↑                                  ↑
   Icon                              Arrow
```

### Template Detail (Detail View)
```
┌─────────────────────────────────────────┐
│  [← Back]                               │
│                                         │
│  📚 Beginner-Friendly Deck              │
│                                         │
│  Description text here...               │
│                                         │
│  FORMAT                                 │
│  Presenter Slides                       │
│                                         │
│  LENGTH                                 │
│  Default                                │
│                                         │
│  PROMPT                                 │
│  ┌───────────────────────────────────┐ │
│  │ Prompt preview...                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      ✨ Build It                  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Color Scheme

```
Primary Blue:    #1a73e8  ████  (Google Blue)
Light Blue:      #e8f0fe  ████  (Hover states)
Dark Gray:       #202124  ████  (Text)
Medium Gray:     #5f6368  ████  (Secondary text)
Light Gray:      #e8eaed  ████  (Borders)
Background:      #f8f9fa  ████  (Surfaces)
White:           #ffffff  ████  (Cards)
```

## Interaction States

### Icon Button
```
Normal:   opacity: 0.7, scale: 1.0
Hover:    opacity: 1.0, scale: 1.05, shadow
Click:    Opens overlay
```

### Template Card
```
Normal:   border: #e8eaed
Hover:    border: #1a73e8, shadow, translateY(-2px)
Click:    Shows detail view
```

### Build Button
```
Normal:   gradient blue, shadow
Hover:    translateY(-2px), larger shadow
Click:    Runs automation, closes overlay
```

## Responsive Behavior

### Modal Size
```
Desktop:  520px width
Tablet:   90vw (max-width)
Mobile:   90vw (max-width)
Height:   80vh (max-height, scrollable)
```

### Dragging
```
Titlebar:  cursor: move
Dragging:  cursor: grabbing
Bounds:    Constrained to viewport
```

## Animation Timing

```
Overlay Open:   0.22s ease (opacity + scale)
Overlay Close:  0.22s ease (opacity + scale)
Card Hover:     0.2s ease (all properties)
Button Hover:   0.2s ease (transform + shadow)
```

## Z-Index Layers

```
Page Content:           z-index: 1
NotebookLM Modal:       z-index: 1000 (approx)
Extension Icon:         z-index: 1000
Extension Overlay:      z-index: 2147483647 (max)
```

## Accessibility

### Keyboard Support
- `Escape`: Close overlay
- `Tab`: Navigate through elements
- `Enter`: Activate buttons

### ARIA Labels
- Icon button: `title="Open Template Library"`
- Close button: `title="Close"`
- Back button: Clear text label

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trap in modal (optional enhancement)

## Browser DevTools View

```
Elements Tab:
├── body
│   ├── ... (NotebookLM content)
│   ├── #__nlm-ext-icon (injected icon)
│   └── #__nlm-ext-modal (injected overlay)
│       ├── .nlm-modal-titlebar
│       │   ├── h2
│       │   └── #__nlm-close
│       └── .nlm-modal-body
│           └── (template list or detail)

Console Tab:
[NLM Extension] Content script loaded
[NLM Extension] Modal detected, injecting icon...
[NLM Extension] Icon injected successfully
[NLM Extension] Overlay built
[NLM Automation] Starting automation...
[NLM Automation] Clicking format: Presenter Slides
[NLM Automation] Clicking length: default
[NLM Automation] Filling prompt...
[NLM Automation] Prompt filled successfully
```

---

**Tip**: Use Chrome DevTools (F12) to inspect the injected elements and see the console logs!
