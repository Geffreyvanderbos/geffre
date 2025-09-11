// Top 'sidebar' functionality

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar-bio");
  const menuButton = document.querySelector(".menu-button");
  let lastFocusedElement = null;
  let userHasScrolled = localStorage.getItem("sidebarScrolled") === "true";
  let isHintAnimating = false;

  // Add scroll listener immediately for mobile sidebar
  if (sidebar) {
    sidebar.addEventListener("scroll", function () {
      console.log("Scroll detected, isHintAnimating:", isHintAnimating);
      if (!isHintAnimating) {
        console.log("Setting userHasScrolled to true");
        userHasScrolled = true;
        localStorage.setItem("sidebarScrolled", "true");
      }
    });
  }

  function openSidebar() {
    lastFocusedElement = document.activeElement;
    sidebar.classList.add("sidebar-open");
    menuButton && menuButton.setAttribute("aria-expanded", "true");
    sidebar && sidebar.setAttribute("aria-hidden", "false");
    // Ensure body is padded exactly to the actual menu height
    if (sidebar) {
      const updateMenuHeight = () => {
        const rect = sidebar.getBoundingClientRect();
        document.documentElement.style.setProperty("--menu-height", rect.height + "px");
      };
      // Measure immediately after opening
      updateMenuHeight();
      // And on next frame to catch transition/layout
      requestAnimationFrame(updateMenuHeight);
      // Keep it in sync on resize while open
      window.addEventListener("resize", updateMenuHeight, { passive: true });
      // Store remover on element for cleanup
      sidebar._removeResize = () => window.removeEventListener("resize", updateMenuHeight);
    }
    document.body.classList.add("sidebar-pushed");
    // Focus sidebar for accessibility
    sidebar.focus();
  }

  function showScrollHint() {
    if (sidebar) {
      const originalScrollTop = sidebar.scrollTop;

      isHintAnimating = true;

      sidebar.scrollTo({
        top: originalScrollTop + 40,
        behavior: "smooth",
      });

      setTimeout(() => {
        sidebar.scrollTo({
          top: originalScrollTop,
          behavior: "smooth",
        });
        setTimeout(() => {
          isHintAnimating = false;
        }, 1800);
      }, 600);
    }
  }

  function closeSidebar() {
    // Start animating body padding back to 0 while sidebar slides up
    document.documentElement.style.setProperty("--menu-height", "0px");
    sidebar.classList.remove("sidebar-open");
    menuButton && menuButton.setAttribute("aria-expanded", "false");
    sidebar && sidebar.setAttribute("aria-hidden", "true");
    // Wait for the slide-up transition to finish before removing body padding
    const onTransitionEnd = (event) => {
      if (event.target === sidebar && event.propertyName === "transform") {
        sidebar.removeEventListener("transitionend", onTransitionEnd);
        document.body.classList.remove("sidebar-pushed");
        // Cleanup and clear dynamic height
        if (sidebar && sidebar._removeResize) {
          sidebar._removeResize();
          delete sidebar._removeResize;
        }
        document.documentElement.style.removeProperty("--menu-height");
      }
    };
    sidebar.addEventListener("transitionend", onTransitionEnd);
    // Fallback in case transitionend doesn't fire
    clearTimeout(sidebar._closeFallbackTimeout);
    sidebar._closeFallbackTimeout = setTimeout(() => {
      if (sidebar.classList.contains("sidebar-open")) return; // already reopened
      sidebar.removeEventListener("transitionend", onTransitionEnd);
      document.body.classList.remove("sidebar-pushed");
      if (sidebar && sidebar._removeResize) {
        sidebar._removeResize();
        delete sidebar._removeResize;
      }
      document.documentElement.style.removeProperty("--menu-height");
    }, 1100);
    // Restore focus
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", function () {
      if (!sidebar.classList.contains("sidebar-open")) {
        openSidebar();
      } else {
        closeSidebar();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("sidebar-open")) {
      closeSidebar();
    }
  });
});
