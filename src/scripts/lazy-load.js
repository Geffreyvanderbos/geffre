if ('IntersectionObserver' in window) {
    document.addEventListener("DOMContentLoaded", function() {
    // console.log("IntersectionObserver found")
      function handleIntersection(entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // console.log("Image intersecting: " + entry.target.className)
            if (entry.target.dataset.bgimage) {
                console.log("Background image found on: " + entry.target.className)
                entry.target.style.backgroundImage = "url('"+entry.target.dataset.bgimage+"')";
            }
            observer.unobserve(entry.target);
          }
        });
      }
  
      const lazyimages = document.querySelectorAll('.lazy-loaded');
      const observer = new IntersectionObserver(
        handleIntersection,
        { rootMargin: "100px" }
      );
      lazyimages.forEach(image => observer.observe(image));
    });
  } else {
    // No interaction support?
    const lazyimages = document.querySelectorAll('.lazy-loaded');
    lazyimages.forEach(image => {
        image.style.backgroundImage = "url('"+image.dataset.bgimage+"')";
    });
  }