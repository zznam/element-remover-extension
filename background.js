let autoRemoveIntervals = {}

// Function to remove elements
function removeElements(tabId, selector) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((el) => el.remove())
    },
    args: [selector],
  })
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateAutoRemove") {
    if (message.isEnabled) {
      // Get all tabs and set up auto-remove
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.url.startsWith("http")) {
            setupAutoRemove(tab.id, message.selector)
          }
        })
      })
    } else {
      // Clear all intervals
      Object.values(autoRemoveIntervals).forEach((interval) =>
        clearInterval(interval)
      )
      autoRemoveIntervals = {}
    }
  }
})

// Set up auto-remove for a specific tab
function setupAutoRemove(tabId, selector) {
  // Clear existing interval if any
  if (autoRemoveIntervals[tabId]) {
    clearInterval(autoRemoveIntervals[tabId])
  }

  // Set new interval
  autoRemoveIntervals[tabId] = setInterval(() => {
    removeElements(tabId, selector)
  }, 3000)
}

// Handle new tab creation
chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get(["isAutoRemoveEnabled", "selector"], (result) => {
    if (result.isAutoRemoveEnabled && tab.url?.startsWith("http")) {
      setupAutoRemove(tab.id, result.selector)
    }
  })
})

// Handle tab updates (URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.sync.get(["isAutoRemoveEnabled", "selector"], (result) => {
      if (result.isAutoRemoveEnabled && tab.url?.startsWith("http")) {
        setupAutoRemove(tabId, result.selector)
      }
    })
  }
})

// Clean up intervals when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (autoRemoveIntervals[tabId]) {
    clearInterval(autoRemoveIntervals[tabId])
    delete autoRemoveIntervals[tabId]
  }
})

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
