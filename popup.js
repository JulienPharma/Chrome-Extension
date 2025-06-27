document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("status").innerText = "Scraping...";
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const isPipeline = tab.url.includes("linkedin.com/talent/hire/") && tab.url.includes("/manage/");
      const isSearch = tab.url.includes("/discover/recruiterSearch");
      if (isPipeline || isSearch) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["contentScript.js"]
        }, () => {
          document.getElementById("status").innerText = "Scraping started!";
        });
      } else {
        document.getElementById("status").innerText = "Please open a LinkedIn pipeline or search page.";
      }
    });
  });
  