/**
 * ESP32 LAB - Professional, performant UI animations powered by GSAP.
 * Gentle, subtle on-load & after-load choreography for brand, navigation,
 * status cards, lessons, and interactive progress bars.
 */

(function () {
  'use strict';

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('[ESP32 LAB] GSAP not found, animations skipped.');
    return;
  }

  // Accessibility: respect reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------
  // 1. Initial Loader Animation (Pre-load / On-load)
  // ----------------------------------------------------
  function initLoaderAnimation() {
    if (prefersReducedMotion) return;

    const loaderLogo = document.querySelector('.loader-logo');
    if (!loaderLogo) return;

    // Gentle breathing pulse on the loader chip
    gsap.to(loaderLogo, {
      scale: 1.035,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      transformOrigin: 'center center'
    });

    // Subtle wave pulse on the internal orange antenna arcs
    const wifiArcs = loaderLogo.querySelectorAll('path, circle');
    if (wifiArcs.length) {
      gsap.to(wifiArcs, {
        opacity: 0.65,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: 'power1.inOut'
      });
    }
  }

  // ----------------------------------------------------
  // 2. Entrance Animation (After-load sequence)
  // ----------------------------------------------------
  let entranceFired = false;

  function runEntranceAnimation() {
    if (entranceFired) return;
    entranceFired = true;

    if (prefersReducedMotion) {
      // Immediate clean reveal without spatial displacement
      gsap.fromTo(
        ['.brand', '.sidebar', '.status', '.info-card', '.code-card', '.viewbar', '.lessons'],
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.05, clearProps: 'all' }
      );
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.75 },
      onComplete: () => {
        // Clear all inline styles so native CSS layout & hover states remain pristine
        gsap.set([
          '.brand-logo',
          '.brand-text h1',
          '.brand-text p',
          '.brand-desc',
          '.side-nav li',
          '.credit-side',
          '.side-desert',
          '.progress-card',
          '.progress-track',
          '.progress-fill',
          '.progress-count',
          '.clock',
          '.status-cactus',
          '.info-card',
          '.viewbar',
          '.code-card',
          '.lessons h2',
          '.lesson-card'
        ], { clearProps: 'transform,opacity,filter' });

        // Trigger gentle initial progress bar glow sweep
        shimmerProgressBar();
      }
    });

    // Top-Left Brand Header (Staggered gentle slide-in)
    tl.from('.brand-logo', {
      scale: 0.86,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(1.4)'
    }, 0.05);

    tl.from('.brand-text h1', {
      y: -14,
      opacity: 0,
      duration: 0.6
    }, 0.12);

    tl.from('.brand-text p', {
      y: -8,
      opacity: 0,
      duration: 0.55
    }, 0.22);

    tl.from('.brand-desc', {
      y: -6,
      opacity: 0,
      duration: 0.55
    }, 0.3);

    // Left Navigation Bar (Delicate cascade)
    tl.from('.side-nav li', {
      x: -12,
      opacity: 0,
      stagger: 0.04,
      duration: 0.5
    }, 0.15);

    tl.from(['.side-desert', '.credit-side'], {
      opacity: 0,
      duration: 0.6
    }, 0.35);

    // Top-Right Status Card & Progress Bar
    tl.from('.progress-card', {
      y: -12,
      opacity: 0,
      duration: 0.6
    }, 0.2);

    tl.from('.clock', {
      opacity: 0,
      y: -6,
      duration: 0.5
    }, 0.3);

    tl.from('.status-cactus', {
      scale: 0.8,
      opacity: 0,
      duration: 0.55,
      ease: 'back.out(1.5)'
    }, 0.35);

    // Progress Bar Entrance: track expands gently and count fades in
    tl.from('.progress-track', {
      scaleX: 0.85,
      opacity: 0,
      transformOrigin: 'left center',
      duration: 0.6
    }, 0.3);

    tl.from('.progress-count', {
      opacity: 0,
      scale: 1.15,
      duration: 0.5
    }, 0.4);

    // Right Info Panel
    tl.from('.info-card', {
      x: 18,
      opacity: 0,
      duration: 0.75
    }, 0.25);

    // 3D Viewbar Toolbar
    tl.from('.viewbar', {
      y: 12,
      opacity: 0,
      duration: 0.65
    }, 0.35);

    // Bottom Code Card
    tl.from('.code-card', {
      y: 18,
      opacity: 0,
      duration: 0.75
    }, 0.4);

    // Bottom Lessons Carousel
    tl.from('.lessons h2', {
      y: 10,
      opacity: 0,
      duration: 0.5
    }, 0.45);

    const lessonCards = document.querySelectorAll('.lesson-card');
    if (lessonCards.length) {
      tl.from(lessonCards, {
        y: 16,
        opacity: 0,
        stagger: 0.025,
        duration: 0.55
      }, 0.5);
    }
  }

  // ----------------------------------------------------
  // 3. Progress Bar Shimmer & Dynamic Updates
  // ----------------------------------------------------
  function shimmerProgressBar() {
    if (prefersReducedMotion) return;

    const fill = document.getElementById('progress-fill');
    const count = document.getElementById('progress-count');
    const track = document.querySelector('.progress-track');

    if (!fill || !track) return;

    // Subtle soft glow on fill
    gsap.fromTo(fill, 
      { filter: 'drop-shadow(0 0 1px rgba(248, 107, 29, 0.2))' },
      {
        filter: 'drop-shadow(0 0 8px rgba(248, 107, 29, 0.65))',
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(fill, { clearProps: 'filter' });
        }
      }
    );

    if (count) {
      gsap.fromTo(count,
        { scale: 1 },
        { scale: 1.14, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );
    }
  }

  // Watch for dynamic updates to progress (e.g. user completing lessons)
  function setupProgressObserver() {
    const fill = document.getElementById('progress-fill');
    const count = document.getElementById('progress-count');

    if (!fill && !count) return;

    const observer = new MutationObserver((mutations) => {
      let changed = false;
      for (const m of mutations) {
        if (m.type === 'attributes' || m.type === 'childList' || m.type === 'characterData') {
          changed = true;
          break;
        }
      }
      if (changed && entranceFired) {
        shimmerProgressBar();
      }
    });

    if (fill) {
      observer.observe(fill, { attributes: true, attributeFilter: ['style'] });
    }
    if (count) {
      observer.observe(count, { childList: true, characterData: true, subtree: true });
    }
  }

  // ----------------------------------------------------
  // 4. Subtle Interactive Micro-Interactions
  // ----------------------------------------------------
  function setupMicroInteractions() {
    if (prefersReducedMotion) return;

    // Run sketch button gentle spring on hover
    const runBtn = document.querySelector('.btn-run');
    if (runBtn) {
      runBtn.addEventListener('mouseenter', () => {
        gsap.to(runBtn, { scale: 1.05, duration: 0.25, ease: 'power1.out' });
      });
      runBtn.addEventListener('mouseleave', () => {
        gsap.to(runBtn, { scale: 1.0, duration: 0.25, ease: 'power1.out' });
      });
      runBtn.addEventListener('mousedown', () => {
        gsap.to(runBtn, { scale: 0.94, duration: 0.1, ease: 'power1.inOut' });
      });
      runBtn.addEventListener('mouseup', () => {
        gsap.to(runBtn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' });
      });
    }

    // Viewbar buttons subtle tactile bounce
    const viewbarButtons = document.querySelectorAll('.viewbar button');
    viewbarButtons.forEach((btn) => {
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.92, duration: 0.1, ease: 'power1.inOut' });
      });
      btn.addEventListener('mouseup', () => {
        gsap.to(btn, { scale: 1.0, duration: 0.2, ease: 'back.out(1.8)' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1.0, duration: 0.15, ease: 'power1.out' });
      });
    });

    // Info card tabs smooth transition feedback
    const tabs = document.querySelectorAll('.tabs button');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        gsap.fromTo(tab, 
          { scale: 0.96 }, 
          { scale: 1.0, duration: 0.3, ease: 'back.out(2)', clearProps: 'transform' }
        );
        const infoBody = document.querySelector('.info-content');
        if (infoBody) {
          gsap.fromTo(infoBody, 
            { opacity: 0.65, y: 4 }, 
            { opacity: 1.0, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'all' }
          );
        }
      });
    });

    // Progress card hover: trigger a gentle pulse
    const progressCard = document.querySelector('.progress-card');
    if (progressCard) {
      progressCard.style.cursor = 'default';
      progressCard.addEventListener('mouseenter', () => {
        const fill = document.getElementById('progress-fill');
        if (fill) {
          gsap.to(fill, {
            filter: 'drop-shadow(0 0 6px rgba(248, 107, 29, 0.5))',
            duration: 0.3,
            ease: 'power1.out'
          });
        }
      });
      progressCard.addEventListener('mouseleave', () => {
        const fill = document.getElementById('progress-fill');
        if (fill) {
          gsap.to(fill, {
            filter: 'drop-shadow(0 0 0px rgba(248, 107, 29, 0))',
            duration: 0.3,
            ease: 'power1.out',
            clearProps: 'filter'
          });
        }
      });
    }
  }

  // ----------------------------------------------------
  // 5. Lifecycle Hooks
  // ----------------------------------------------------
  // Start loader animation immediately
  initLoaderAnimation();

  // Watch for loader dismissal (document.documentElement losing 'is-loading' class)
  const docObserver = new MutationObserver(() => {
    if (!document.documentElement.classList.contains('is-loading')) {
      docObserver.disconnect();
      // Slight 40ms tick to ensure display transitions have started
      requestAnimationFrame(() => {
        runEntranceAnimation();
      });
    }
  });

  docObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Fallback: in case loader finishes before observer or DOM is already loaded
  if (!document.documentElement.classList.contains('is-loading')) {
    setTimeout(runEntranceAnimation, 80);
  }

  // Setup after-load observers and micro-interactions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupProgressObserver();
      setupMicroInteractions();
    });
  } else {
    setupProgressObserver();
    setupMicroInteractions();
  }

})();
