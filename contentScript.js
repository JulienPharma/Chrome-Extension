// ✅ FINAL LINKEDIN PIPELINE EXTENSION
// Scrolls, paginates, extracts public URLs by resolving Recruiter profile IDs

(async () => {
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    const collected = new Set();
    const processedIds = new Set();
  
    const anchorSelector = 'a[href*="/talent/profile/"], a[href*="/recruiter/profile/"]';
  
    async function scrollFully() {
      let lastScroll = -1;
      while (true) {
        window.scrollBy(0, 400);
        await wait(300);
        let current = document.documentElement.scrollTop || document.body.scrollTop;
        if (current === lastScroll) break;
        lastScroll = current;
      }
      console.log("📜 Scroll complete");
    }
  
    function extractProfileIds() {
      const anchors = document.querySelectorAll(anchorSelector);
      const ids = [];
      anchors.forEach((a) => {
        const match = a.href.match(/\/profile\/(AEM[^?\s\/"]+)/);
        if (match && !processedIds.has(match[1])) {
          processedIds.add(match[1]);
          ids.push(match[1]);
        }
      });
      console.log(`🔍 Found ${ids.length} profile IDs`);
      return ids;
    }
  
    async function resolvePublicUrl(profileId) {
      try {
        const res = await fetch(`https://www.linkedin.com/in/${profileId}`, { method: 'GET', redirect: 'follow' });
        const finalUrl = res.url;
        if (finalUrl.includes('/in/') && !collected.has(finalUrl)) {
          collected.add(finalUrl);
          console.log("✅ Resolved:", finalUrl);
        }
      } catch (err) {
        console.warn("❌ Failed to resolve:", profileId);
      }
    }
  
    async function resolveBatch(ids) {
      for (let id of ids) {
        await resolvePublicUrl(id);
        await wait(300); // polite pacing
      }
    }
  
    function goToNextPage() {
      const next = document.querySelector('a[data-test-pagination-next]');
      if (next && !next.getAttribute('aria-disabled')) {
        next.click();
        console.log("➡️ Going to next page...");
        return true;
      }
      return false;
    }
  
    while (true) {
      await wait(2000);
      await scrollFully();
      const ids = extractProfileIds();
      await resolveBatch(ids);
      if (!goToNextPage()) break;
      await wait(4000);
    }
  
    if (collected.size === 0) {
      alert("⚠️ No public LinkedIn URLs were collected.");
      return;
    }
  
    // Trigger CSV download
    const csv = "Profile URL\n" + Array.from(collected).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkedin_pipeline_profiles.csv";
    a.click();
    URL.revokeObjectURL(url);
  
    alert(`✅ Scraping complete! Downloaded ${collected.size} profiles.`);
  })();
  