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
      // Handle script loading errors
      wrapper.innerHTML =
        '<p class="microblog-error">Unable to load comments</p>';
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
