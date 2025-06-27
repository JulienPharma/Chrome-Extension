chrome.action.onClicked.addListener((tab) => {
    const isPipeline = tab.url.includes("linkedin.com/talent/hire/") && tab.url.includes("/manage/");
    const isSearch = tab.url.includes("/discover/recruiterSearch");
    if (isPipeline || isSearch) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"]
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("❌ Please open a LinkedIn Recruiter pipeline or search page before clicking the extension.")
      });
    }
  });
  