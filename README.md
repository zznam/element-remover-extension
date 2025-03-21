# Element Remover Chrome Extension

A lightweight Chrome extension that allows you to remove unwanted elements from any webpage using CSS selectors. Perfect for cleaning up cluttered websites or removing annoying elements that distract from content.

## Features

- 🎯 Remove elements using CSS selectors
- 🔄 Auto-remove mode that checks every 3 seconds
- 🌓 Dark/Light theme support
- 👆 One-click manual removal
- 💡 Simple and intuitive interface

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the Element Remover extension icon in your Chrome toolbar
2. Enter a CSS selector for the elements you want to remove (e.g., `.ad-banner`, `#popup-overlay`)
3. Choose your preferred removal method:
   - Click "Remove Elements Now" for one-time removal
   - Toggle "Auto Remove" to automatically remove matching elements every 3 seconds

## Theme Support

The extension automatically adapts to your system's theme preferences and includes:

- Light theme for bright environments
- Dark theme for reduced eye strain in low-light conditions

## Development

### Project Structure

- `manifest.json`: Extension configuration and permissions
- `popup.html`: UI for user interaction
- `popup.js`: UI logic and event handling
- `background.js`: Background script for auto-remove functionality
- `content.js`: Content script for element removal
