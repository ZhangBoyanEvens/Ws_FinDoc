import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { DualWaveAnimation } from "./dual-wave/DualWaveAnimation.js";
import { preloadImages } from "./utils.js";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Initialize smooth scroll with graceful fallback.
// Some environments may not support ScrollSmoother at runtime; in that case
// we keep native scrolling instead of blocking interactions.
try {
  if (typeof ScrollSmoother?.create === "function") {
    ScrollSmoother.create({
      smooth: 1.5,
      normalizeScroll: true,
    });
  }
} catch (error) {
  console.warn("ScrollSmoother unavailable, fallback to native scroll:", error);
}

// Initialize dual wave animation
const wrapper = document.querySelector(".dual-wave-wrapper");
if (wrapper) {
  const animation = new DualWaveAnimation(wrapper);
  // Wait for all images to preload before initializing layout and scroll effects
  preloadImages(".dual-wave-wrapper")
    .then(() => {
      animation.init();
    })
    .catch((error) => {
      console.warn("Image preload failed, continue with native assets:", error);
      animation.init();
    })
    .finally(() => {
      document.body.classList.remove("loading");
    });
} else {
  document.body.classList.remove("loading");
}
