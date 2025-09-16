document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("microblog-conversation__wrapper");

  if (!wrapper) return;

  const expand = () => {
    // Force a layout so the browser knows the current height (0)
    wrapper.style.height = "0";

    // Wait until the next paint – ensures the new nodes are measured
    requestAnimationFrame(() => {
      // Now the browser has computed scrollHeight for the fresh content
      const target = wrapper.scrollHeight + "px";
      wrapper.style.height = target;
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

  function removeSpinnerWithFadeOut(spinner) {
    spinner.classList.add("fade-out");
    setTimeout(() => {
      spinner.remove();
    }, 620); // Match your animation duration
  }

  // Load the microblog script dynamically
  const conversationUrl = wrapper.getAttribute("data-conversation-url");

  if (conversationUrl) {
    // Create and append the script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://micro.blog/conversation.js?url=${conversationUrl}`;

    // Override document.write to capture content and inject into our wrapper
    const originalWrite = document.write;
    let capturedContent = "";

    document.write = function (content) {
      capturedContent += content;
    };

    script.onload = function () {
      // Insert all captured content at once
      if (capturedContent) {
        wrapper.innerHTML = capturedContent;
      }

      // Restore original document.write after script completes
      document.write = originalWrite;

      // Flashy remove of spinner
      removeSpinnerWithFadeOut(document.querySelector(".spinner-container"));
    };

    script.onerror = function () {
      // Flashy remove of spinner
      removeSpinnerWithFadeOut(document.querySelector(".spinner-container"));
      // Handle script loading errors
      wrapper.innerHTML = `<p class="microblog-error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-crack-icon lucide-heart-crack"><path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15"/><path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z"/></svg>
        &nbsp;Unable to load replies</p>`;
      document.write = originalWrite;
    };

    // Append script to trigger loading
    document.head.appendChild(script);
  }

  // Handle case where content is already present
  if (wrapper.childElementCount) {
    requestAnimationFrame(expand);
  }
});
