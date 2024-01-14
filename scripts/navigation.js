const nav = document.querySelector(".navigation");
const supportPageOffset = window.pageXOffset !== undefined;
const isCSS1Compat = (document.compatMode || "") === "CSS1Compat";

let previousScrollPosition = 0;

const isScrollingDown = () => {
let scrolledPosition = supportPageOffset
  ? window.pageYOffset
  : isCSS1Compat
  ? document.documentElement.scrollTop
  : document.body.scrollTop;
let isScrollDown;

if (scrolledPosition > previousScrollPosition) {
  isScrollDown = true;
} else {
  isScrollDown = false;
}
previousScrollPosition = scrolledPosition;
return isScrollDown;
};

const handleNavScroll = () => {
if (isScrollingDown() && !nav.contains(document.activeElement)) {
  nav.classList.add("navigation--down");
  nav.classList.remove("navigation--up");
} else {
  nav.classList.add("navigation--up");
  nav.classList.remove("navigation--down");
}
};

var throttleTimer;

const throttle = (callback, time) => {
if (throttleTimer) return;

throttleTimer = true;
setTimeout(() => {
  callback();
  throttleTimer = false;
}, time);
};

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("scroll", () => {
if (mediaQuery && !mediaQuery.matches) {
  throttle(handleNavScroll, 250);
}
});

// Set Up JavaScript to Detect First Visit and Control Scrolling
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('hasVisited')) {
      localStorage.setItem('hasVisited', 'true');
      
      const navigation = document.querySelector('.navigation__list');
      if (navigation) {
          navigation.classList.add('navigation--animate');

          navigation.addEventListener('animationend', () => {
              navigation.classList.remove('navigation--animate');
          });
      }
  }
});