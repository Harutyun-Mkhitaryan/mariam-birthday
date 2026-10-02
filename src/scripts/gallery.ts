import { animatedDialog, prefersReducedMotion } from './motion';

/** Memories: "View full gallery" expander + lightbox with keyboard / swipe navigation. */
export function initGallery(): void {
  /* ── expander ───────────────────────────────────── */
  const toggle = document.querySelector<HTMLButtonElement>('[data-gallery-toggle]');
  const more = document.querySelector<HTMLElement>('[data-gallery-more]');
  if (toggle && more) {
    const label = toggle.querySelector('.btn__label');
    toggle.addEventListener('click', () => {
      const expand = more.hidden;
      toggle.setAttribute('aria-expanded', String(expand));
      if (label) label.textContent = expand ? toggle.dataset.labelLess! : toggle.dataset.labelMore!;
      if (expand) {
        more.classList.add('is-pre');
        more.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => more.classList.remove('is-pre')));
        const first = more.querySelector<HTMLElement>('[data-lightbox-open]');
        if (!prefersReducedMotion()) {
          const top = more.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35;
          if (top > window.scrollY) window.scrollTo({ top, behavior: 'smooth' });
        }
        first?.focus({ preventScroll: true });
      } else {
        more.hidden = true;
      }
    });
  }

  /* ── lightbox ───────────────────────────────────── */
  const box = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!box || typeof box.showModal !== 'function') return;

  const cards = [...document.querySelectorAll<HTMLButtonElement>('[data-lightbox-open]')].sort(
    (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
  );
  const img = box.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const avif = box.querySelector<HTMLSourceElement>('[data-lightbox-avif]')!;
  const webp = box.querySelector<HTMLSourceElement>('[data-lightbox-webp]')!;
  const caption = box.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const counter = box.querySelector<HTMLElement>('[data-lightbox-index]')!;
  let current = 0;

  const show = (i: number, dir = 0) => {
    current = (i + cards.length) % cards.length;
    const c = cards[current];
    box.classList.remove('is-loaded');
    box.style.setProperty('--dir', String(dir));
    const sizes = c.dataset.fullSizes || '90vw';
    avif.srcset = c.dataset.fullAvif || '';
    avif.sizes = sizes;
    webp.srcset = c.dataset.fullWebp || '';
    webp.sizes = sizes;
    img.sizes = sizes;
    img.src = c.dataset.fullSrc || '';
    img.alt = c.dataset.alt || '';
    caption.textContent = c.dataset.caption || '';
    counter.textContent = String(current + 1).padStart(2, '0');
    const done = () => box.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) requestAnimationFrame(done);
    else img.addEventListener('load', done, { once: true });
    // warm the neighbours
    [current - 1, current + 1].forEach((n) => {
      const nb = cards[(n + cards.length) % cards.length];
      const pre = new Image();
      pre.src = nb.dataset.fullSrc || '';
    });
  };

  const dlg = animatedDialog(box);
  cards.forEach((card) =>
    card.addEventListener('click', () => {
      show(Number(card.dataset.index));
      dlg.open(card);
      box.querySelector<HTMLElement>('[data-lightbox-close]')?.focus();
    }),
  );
  box.querySelector('[data-lightbox-close]')?.addEventListener('click', () => void dlg.close());
  box.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(current - 1, -1));
  box.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(current + 1, 1));

  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(current - 1, -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(current + 1, 1);
    }
  });

  // swipe
  let x0: number | null = null;
  box.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  box.addEventListener(
    'touchend',
    (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 48) show(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      x0 = null;
    },
    { passive: true },
  );
}
