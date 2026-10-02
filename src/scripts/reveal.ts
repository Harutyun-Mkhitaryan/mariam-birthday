/**
 * Scroll reveals: every [data-reveal-group] gets `.is-inview` once it crosses
 * the threshold (20% into the viewport, Animation-Spec → Letter). Children
 * with [data-reveal] animate with their own --i stagger (see motion.css).
 * Groups can listen for the `reveal` event (letter typewriter, heart pulse…).
 */
export function initReveal(): void {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-reveal-group]')];
  if (!groups.length) return;

  const show = (el: HTMLElement) => {
    if (el.classList.contains('is-inview')) return;
    el.classList.add('is-inview');
    el.dispatchEvent(new CustomEvent('reveal', { bubbles: false }));
  };

  if (!('IntersectionObserver' in window)) {
    groups.forEach(show);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target as HTMLElement);
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -20% 0px', threshold: 0 },
  );
  groups.forEach((g) => io.observe(g));
}
