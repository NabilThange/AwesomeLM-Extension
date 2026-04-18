# 🚀 Quick Start Guide

Get your NotebookLM extension running in 3 minutes!

## Step 1: Generate Icons (1 minute)

1. Open `generate-icons.html` in your browser (double-click the file)
2. Click each "Download" button (4 total)
3. Save files as: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
4. Move all 4 files into the `icons/` folder

## Step 2: Install Extension (1 minute)

1. Open Chrome
2. Go to: `chrome://extensions`
3. Turn ON "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select the `notebooklm-extension` folder

## Step 3: Use It! (30 seconds)

1. Go to: https://notebooklm.google.com
2. Open any notebook
3. Click "Customize Slide Deck"
4. Look for the 📋 icon (bottom-right of text area)
5. Click it and choose a template!

---

## What You Get

### 3 Pre-Built Templates:

**📚 Beginner-Friendly Deck**
- Clear explanations with visuals
- Step-by-step approach
- Perfect for teaching

**💼 Executive Summary**
- High-level insights
- Data-driven recommendations
- Quick and impactful

**⚙️ Technical Deep Dive**
- Detailed technical content
- Architecture diagrams
- Code examples

---

## How It Works

1. **Icon appears** when you open "Customize Slide Deck"
2. **Click icon** to see template library
3. **Choose template** to see details
4. **Click "Build It"** to auto-fill everything:
   - ✅ Format (Presenter/Detailed)
   - ✅ Length (Short/Default)
   - ✅ Custom prompt

---

## Customization

Want to add your own templates? Edit `overlay.js`:

```javascript
{
  id: 'my-template',
  title: 'My Custom Template',
  description: 'What this template does',
  icon: '🎯',
  format: 'presenter',
  length: 'default',
  prompt: 'Your custom prompt here...'
}
```

---

## Troubleshooting

**Icon not showing?**
- Wait 1-2 seconds after opening the modal
- Refresh the page
- Check console (F12) for errors

**Can't load extension?**
- Make sure icons are in the `icons/` folder
- Check you selected the right folder
- Verify `manifest.json` exists

**Template not working?**
- Ensure modal is fully loaded
- Try clicking "Build It" again
- Check browser console for errors

---

## Next Steps

- Read `README.md` for full documentation
- Check `INSTALL_GUIDE.md` for detailed setup
- Customize templates in `overlay.js`
- Modify styles in `overlay.css`

---

**Need help?** Check the console (F12) for error messages!
