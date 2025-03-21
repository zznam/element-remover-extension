let autoRemoveInterval = null
let currentSelector = ""

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateAutoRemove") {
    updateAutoRemove(request.enabled, request.selector)
    // Send response to confirm receipt
    sendResponse({ status: 'success' })
  }
  // Required for async response
  return true
})

// Function to update auto-remove status
function updateAutoRemove(enabled, selector) {
  clearInterval(autoRemoveInterval)
  autoRemoveInterval = null
  currentSelector = selector

  if (enabled) {
    // Start auto-remove interval (every 3 seconds)
    autoRemoveInterval = setInterval(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          // Check if tab is valid and not on chrome:// or edge:// pages
          if (!tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('edge://')) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "removeElements", selector: currentSelector },
              // Add error handling callback
              (response) => {
                if (chrome.runtime.lastError) {
                  console.log('Error sending message:', chrome.runtime.lastError)
                  // Content script might not be loaded, inject it
                  chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                  }).catch(err => console.log('Failed to inject content script:', err))
                }
              }
            )
          }
        }
      })
    }, 3000)
  }
}

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings if not already set
  chrome.storage.sync.get(["selector", "autoRemove"], (data) => {
    if (!data.selector) {
      chrome.storage.sync.set({ selector: "css-11f1hze" })
    }
    if (data.autoRemove === undefined) {
      chrome.storage.sync.set({ autoRemove: false })
    }
  })
})

// When Chrome starts, check if auto-remove should be enabled
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(["autoRemove", "selector"], (data) => {
    if (data.autoRemove && data.selector) {
      updateAutoRemove(true, data.selector)
    }
  })
})

