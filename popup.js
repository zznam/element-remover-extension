document.addEventListener("DOMContentLoaded", () => {
  const selectorInput = document.getElementById("selector")
  const autoRemoveToggle = document.getElementById("auto-remove")
  const removeNowButton = document.getElementById("remove-now")
  const statusDiv = document.getElementById("status")
  const themeToggle = document.getElementById("theme-toggle")
  const darkIcon = document.getElementById("dark-icon")
  const lightIcon = document.getElementById("light-icon")

  // Load saved settings
  chrome.storage.sync.get(["selector", "autoRemove", "darkMode"], (data) => {
    if (data.selector) selectorInput.value = data.selector
    if (data.autoRemove !== undefined) autoRemoveToggle.checked = data.autoRemove

    // Apply theme based on Chrome storage
    updateTheme(data.darkMode)

    // Update auto-remove status in background script
    updateAutoRemoveStatus()
  })

  // Theme toggle button click handler
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark'
    const newTheme = !isDark // Toggle the theme

    // Save theme preference to Chrome storage
    chrome.storage.sync.set({ darkMode: newTheme }, () => {
      updateTheme(newTheme)
    })
  })

  // Style toggle switch
  const toggleBg = document.querySelector(".toggle-bg")
  toggleBg.classList.add(
    "after:content-['']",
    "after:absolute",
    "after:top-[2px]",
    "after:left-[2px]",
    "after:bg-white",
    "after:border-gray-300",
    "after:border",
    "after:rounded-full",
    "after:h-5",
    "after:w-5",
    "after:transition-all",
  )

  autoRemoveToggle.addEventListener("change", function () {
    if (this.checked) {
      toggleBg.classList.add("bg-blue-600", "after:translate-x-full", "after:border-white")
      toggleBg.classList.remove("bg-gray-300", "dark:bg-gray-600")
    } else {
      toggleBg.classList.remove("bg-blue-600", "after:translate-x-full", "after:border-white")
      toggleBg.classList.add("bg-gray-300", "dark:bg-gray-600")
    }

    // Save settings and update background
    saveSettings()
    updateAutoRemoveStatus()
  })

  // Save settings when selector changes
  selectorInput.addEventListener("change", saveSettings)

  // Remove elements now button
  removeNowButton.addEventListener("click", () => {
    saveSettings()

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "removeElements",
          selector: selectorInput.value,
        },
        (response) => {
          if (response && response.count !== undefined) {
            statusDiv.textContent = `Removed ${response.count} element(s)`
            setTimeout(() => {
              statusDiv.textContent = ""
            }, 3000)
          } else {
            statusDiv.textContent = "Error: Could not remove elements"
          }
        },
      )
    })
  })

  function saveSettings() {
    const settings = {
      selector: selectorInput.value,
      autoRemove: autoRemoveToggle.checked,
    }
    chrome.storage.sync.set(settings)
  }

  function updateAutoRemoveStatus() {
    chrome.runtime.sendMessage({
      action: "updateAutoRemove",
      enabled: autoRemoveToggle.checked,
      selector: selectorInput.value,
    })
  }

  // Function to update theme and icons
  function updateTheme(isDark) {
    // Update data-theme attribute
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')

    // Update icons
    updateThemeIcons(isDark)
  }

  // Helper function to update theme icons
  function updateThemeIcons(isDark) {
    if (isDark) {
      darkIcon.classList.remove('hidden')
      lightIcon.classList.add('hidden')
    } else {
      darkIcon.classList.add('hidden')
      lightIcon.classList.remove('hidden')
    }
  }
})

