chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("linkedin.com/talent/hire/") && tab.url.includes("/manage/")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"]
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("❌ Please open a LinkedIn Recruiter pipeline page before clicking the extension.")
      });
    }
  });
  