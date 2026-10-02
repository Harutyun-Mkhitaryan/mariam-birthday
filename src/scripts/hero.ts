import { prefersReducedMotion } from './motion';

/** Very subtle scroll parallax for elements with [data-parallax="factor"]. */
export function initHero(): void {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!layers.length) return;

  let inView = true;
  let raf = 0;

  const update = () => {
    raf = 0;
    if (prefersReducedMotion()) {
      layers.forEach((l) => (l.style.transform = ''));
      return;
    }
    const y = window.scrollY;
    layers.forEach((l) => {
      const k = parseFloat(l.dataset.parallax || '0.08');
      l.style.transform = `translate3d(0, ${(y * k).toFixed(1)}px, 0)`;
    });
  };

  const hero = layers[0].closest('section');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    }).observe(hero);
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!inView || raf) return;
      raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}
