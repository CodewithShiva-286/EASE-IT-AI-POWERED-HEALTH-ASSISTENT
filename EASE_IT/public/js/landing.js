document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.gsap || reduceMotion) {
    document.querySelectorAll(".reveal, .reveal-scale, .reveal-group > *").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".reveal-group > *", {
    opacity: 0,
    y: 26,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1
  });

  gsap.from(".reveal-scale", {
    opacity: 0,
    y: 36,
    scale: 0.96,
    duration: 0.95,
    ease: "power3.out",
    stagger: 0.12
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 34,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 84%"
      }
    });
  });

  gsap.to(".ingredient-float-one", {
    yPercent: -16,
    xPercent: -6,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".ingredient-float-two", {
    yPercent: 18,
    xPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".demo-step").forEach((step, index) => {
    gsap.to(".mini-phone", {
      y: index % 2 === 0 ? -10 : 10,
      rotate: index % 2 === 0 ? -1.2 : 1.2,
      duration: 0.45,
      ease: "power2.out",
      scrollTrigger: {
        trigger: step,
        start: "top 58%",
        toggleActions: "play none none reverse"
      }
    });
  });
});
