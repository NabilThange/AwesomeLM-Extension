# AwesomeLM NotebookLM Assistant

A Chrome extension that enhances NotebookLM's "Customize Slide Deck" feature with pre-built prompt templates from AwesomeLM.

## 🎥 Demo Video

<!-- Native video player -->
<img width="800" height="450" alt="AwesomeLM_extension-guide" src="https://github.com/user-attachments/assets/986e855f-3d1a-4d21-975c-584e4eccc2de" />

<!-- Clickable YouTube thumbnail -->
### Also on YouTube:
[![Watch on YouTube](https://img.youtube.com/vi/O3L7KlMbHxE/maxresdefault.jpg)](https://www.youtube.com/watch?v=O3L7KlMbHxE)

> **Note**: This extension connects to a public Supabase database to fetch prompt templates. The Supabase anon key is intentionally exposed in the code—this is safe and standard practice for public read-only data.

## ✨ Features

* 📋 **Template Library**: Access curated slide deck prompt templates
* 🎨 **Optimized Prompts**: Each template includes professionally crafted prompts
* ⚡ **One-Click Automation**: Automatically fills format, length, and prompt
* 🎯 **Draggable Interface**: Move the template picker anywhere on screen
* 🔄 **Live Updates**: Templates are fetched from AwesomeLM's database in real-time
* 📱 **Fallback Mode**: Works offline with bundled templates

---

## 🚀 Installation Guide

### Step 1: Download the Extension
Choose one of these methods:

#### Option A: Download ZIP (Easiest)
1. Click the green **"Code"** button at the top of this repository.
   ![cd-drpdwn](guide/cd-drpdwn.png)
2. Select **"Download ZIP"**.
   ![dwnld-zip](guide/dwnld-zip.png)
3. Extract the ZIP file to your computer.
   ![extract](guide/extract.png)
4. Navigate to the `Chrome-Extension/AwesomeLM-Extension` folder.

#### Option B: Fork & Clone (For Developers)
1. Click **"Fork"** at the top-right of this repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/NabilThange/AwesomeLM-Extension.git
   cd AwesomeLM-Extension/Chrome-Extension/notebooklm-extension
   ```

### Step 2: Install in Chrome
1. Open `chrome://extensions` in your browser.
   ![ext](guide/ext.png)
2. Enable **"Developer mode"** in the top-right corner.
   ![dev](guide/dev.png)
3. Click **"Load unpacked"** and select the `AwesomeLM-Extension` folder.
   ![load](guide/load.png)
   ![select](guide/select.png)

---

## 📖 How to Use

1. **Open NotebookLM** and navigate to any notebook.
2. **Click "Customize Slide Deck"** to open the slide creation modal.
3. **Wait 1-2 seconds** for the modal to fully load.
4. **Look for the AwesomeLM icon** (📋) in the bottom-right corner of the text area.
5. **Click the icon** to open the template library.
6. **Select a template** and choose:
   * **"Fill"**: Adds the prompt to the text area.
   * **"Build It"**: Fills the prompt AND automatically generates the slides.

---

## 🛠️ File Structure

```text
AwesomeLM-Extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic & cache status
├── content_inject.js      # Detects modal & injects trigger button
├── overlay.js             # Template library UI & modal
├── overlay.css            # Styles for template library
├── automation.js          # NotebookLM form automation
├── lib/
│   ├── cache.js           # Template caching system
│   ├── supabase.js        # Database connection
│   └── nlm.js             # NotebookLM DOM helpers
├── icons/                 # Extension icons
└── icon.svg               # Source icon file
```

---

## 🔧 Technical Details

* **Manifest Version**: 3
* **Permissions**: `storage`
* **Host Permissions**: `notebooklm.google.com`, `supabase.co`
* **Caching**: 1-hour template cache for performance
* **Fallback**: Bundled templates when API is unavailable

## 🐛 Troubleshooting

* **Manifest Missing**: Ensure you selected the `AwesomeLM-Extension` folder specifically, not the root repository folder.
* **Icon Not Appearing**: Refresh the NotebookLM page and ensure the "Customize Slide Deck" modal is active.
* **Loading Loop**: Check your internet connection or disable aggressive ad blockers that might block Supabase calls.

---

## 📄 License
MIT License - Feel free to modify, distribute, and use commercially!

---
**Enjoy creating amazing slide decks with AwesomeLM! 🚀**
