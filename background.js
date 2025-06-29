chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only proceed if the URL has changed and is now available
  if (!changeInfo.url || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
    return;
  }

  try {
    // Query for all tabs with the exact same URL
    const tabs = await chrome.tabs.query({ url: tab.url });

    console.log('Tab updated with URL:', tab.url);
    console.log('Found matching tabs:', tabs);

    // If more than one tab exists, close the new one and activate the old one
    if (tabs.length > 1) {
      // Find the existing tab (not the new one)
      const existingTab = tabs.find(t => t.id !== tab.id);
      if (existingTab) {
        await chrome.tabs.remove(tab.id);
        await chrome.tabs.update(existingTab.id, { active: true });
      }
    }
  } catch (error) {
    console.warn('Error processing URL:', tab.url, error);
  }
});
