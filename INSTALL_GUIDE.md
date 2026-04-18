# Installation Guide

## Quick Start (5 minutes)

### Step 1: Prepare Icons
Before loading the extension, you need icon files. Choose one option:

**Option A - Quick Placeholder (Fastest)**
1. Find any small PNG image (like a screenshot or logo)
2. Rename it 4 times: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
3. Put all 4 files in the `icons/` folder

**Option B - Proper Icons (Recommended)**
1. Go to https://www.favicon-generator.org/
2. Upload a square image (the `icon.svg` or any 📋 template icon)
3. Download the generated icons
4. Copy `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png` to the `icons/` folder

### Step 2: Load Extension in Chrome

1. Open Chrome browser
2. Type `chrome://extensions` in the address bar and press Enter
3. Toggle **"Developer mode"** ON (top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select the `notebooklm-extension` folder
6. Click "Select Folder"

✅ You should see "AwesomeLM NotebookLM Assistant" appear in your extensions list!

### Step 3: Test It

1. Go to https://notebooklm.google.com
2. Open any notebook
3. Click **"Customize Slide Deck"** button
4. Look for the 📋 icon in the bottom-right of the text area
5. Click it to open the template library!

## Troubleshooting

### "Manifest file is missing or unreadable"
- Make sure you selected the `notebooklm-extension` folder (not a parent folder)
- Check that `manifest.json` exists in the folder

### "Could not load icon"
- You need to add PNG icon files to the `icons/` folder
- See Step 1 above for quick solutions

### Icon doesn't appear on NotebookLM
- Make sure you clicked "Customize Slide Deck" to open the modal
- Wait 1-2 seconds for the modal to fully load
- Check browser console (F12) for errors
- Try refreshing the page

### Template doesn't apply
- Ensure all form elements are visible in the modal
- Try clicking "Build It" again
- Check that you're using the latest version of Chrome

## Updating the Extension

After making any code changes:

1. Go to `chrome://extensions`
2. Find "AwesomeLM NotebookLM Assistant"
3. Click the refresh icon (🔄)
4. Reload the NotebookLM page

## Uninstalling

1. Go to `chrome://extensions`
2. Find "AwesomeLM NotebookLM Assistant"
3. Click "Remove"
4. Confirm removal

## Need Help?

Check the main README.md for:
- Feature documentation
- Template customization
- Technical details
- Development guide
