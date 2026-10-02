import { animatedDialog, prefersReducedMotion } from './motion';

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  /* ── scrolled state ─────────────────────────────── */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── active section → aria-current ───────────────── */
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
  const sections = [...new Set(links.map((l) => l.dataset.navLink))]
    .map((id) => document.getElementById(id!))
    .filter((el): el is HTMLElement => !!el);

  const setCurrent = (id: string) => {
    links.forEach((l) => {
      if (l.dataset.navLink === id) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = '';
        let max = 0;
        visible.forEach((ratio, id) => {
          if (ratio > max) {
            max = ratio;
            best = id;
          }
        });
        if (best) setCurrent(best);
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ── mobile menu ─────────────────────────────────── */
  const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!menu || !toggle || typeof menu.showModal !== 'function') return;

  const dlg = animatedDialog(menu, {
    onOpen: () => toggle.setAttribute('aria-expanded', 'true'),
    onClose: () => toggle.setAttribute('aria-expanded', 'false'),
  });

  toggle.addEventListener('click', () => dlg.open(toggle));
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => void dlg.close());

  menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((a) =>
    a.addEventListener('click', async (e) => {
      const hash = a.getAttribute('href');
      if (!hash?.startsWith('#')) return;
      e.preventDefault();
      await dlg.close();
      const target = document.querySelector<HTMLElement>(hash);
      target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', hash);
    }),
  );

  // close if the viewport grows past the mobile breakpoint
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches && dlg.isOpen) void dlg.close();
  });
}
