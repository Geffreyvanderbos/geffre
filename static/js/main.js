document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("microblog-conversation__wrapper");
  if (!wrapper) return;

  const expand = () => {
    // 1️⃣ Force a layout so the browser knows the current height (0)
    wrapper.style.height = "0";

    // 2️⃣ Wait until the next paint – ensures the new nodes are measured
    requestAnimationFrame(() => {
      // Now the browser has computed scrollHeight for the fresh content
      const target = wrapper.scrollHeight + "px";
      wrapper.style.height = target; // CSS transition animates this
    });
  };

  const observer = new MutationObserver((mutations) => {
    // We only need to act on the *first* mutation that actually adds nodes
    const added = mutations.some((m) => m.addedNodes.length);
    if (added) {
      expand(); // kick off the smooth growth
      // If you never expect further changes, disconnect now:
      observer.disconnect();
    }
  });

  observer.observe(wrapper, { childList: true, subtree: true });

  if (wrapper.childElementCount) {
    requestAnimationFrame(expand);
  }
});
