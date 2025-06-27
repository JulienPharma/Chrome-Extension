document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("status").innerText = "Scraping...";
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("linkedin.com/talent/hire/") && tab.url.includes("/manage/")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["contentScript.js"]
        }, () => {
          document.getElementById("status").innerText = "Scraping started!";
        });
      } else {
        document.getElementById("status").innerText = "Please open a LinkedIn pipeline page.";
      }
    });
  });
  