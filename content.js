// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "removeElements") {
    const count = removeElements(request.selector)
    sendResponse({ count: count })
    return true
  }
})

// Function to remove elements matching the selector
function removeElements(selector) {
  try {
    const elements = document.querySelectorAll(selector)
    let count = 0

    elements.forEach((element) => {
      element.remove()
      count++
    })

    return count
  } catch (error) {
    console.error("Error removing elements:", error)
    return 0
  }
}

