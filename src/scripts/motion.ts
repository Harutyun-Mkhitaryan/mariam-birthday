/** Shared motion helpers. */
const query = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export const prefersReducedMotion = (): boolean => !!query?.matches;

export const onReducedMotionChange = (cb: (reduced: boolean) => void): void => {
  query?.addEventListener('change', (e) => cb(e.matches));
};

/** Resolve after `ms`, immediately under reduced motion. */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion() ? 0 : ms));

/** Lock / unlock page scroll while a modal is open (keeps scrollbar width stable). */
export const lockScroll = (locked: boolean): void => {
  const root = document.documentElement;
  if (locked) {
    const gap = window.innerWidth - root.clientWidth;
    document.body.style.paddingRight = gap > 0 ? `${gap}px` : '';
    document.body.classList.add('is-locked');
  } else {
    document.body.style.paddingRight = '';
    document.body.classList.remove('is-locked');
  }
};

/**
 * Open a <dialog> with a CSS fade (class `.is-open`) and close it after the
 * transition. Esc is routed through the same animated close.
 */
export const animatedDialog = (dialog: HTMLDialogElement, opts: { onClose?: () => void; onOpen?: () => void } = {}) => {
  let closing = false;
  let returnFocus: HTMLElement | null = null;

  const open = (opener?: HTMLElement | null) => {
    if (dialog.open) return;
    returnFocus = opener ?? (document.activeElement as HTMLElement | null);
    dialog.showModal();
    lockScroll(true);
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
    opts.onOpen?.();
  };

  const close = (): Promise<void> =>
    new Promise((resolve) => {
      if (!dialog.open || closing) return resolve();
      closing = true;
      dialog.classList.remove('is-open');
      const done = () => {
        closing = false;
        dialog.close();
        lockScroll(false);
        opts.onClose?.();
        returnFocus?.focus({ preventScroll: true });
        resolve();
      };
      const ms = prefersReducedMotion() ? 0 : parseFloat(getComputedStyle(dialog).transitionDuration) * 1000 || 0;
      window.setTimeout(done, ms);
    });

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    void close();
  });
  // click on the backdrop area (the dialog element itself) closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) void close();
  });

  return { open, close, get isOpen() { return dialog.open; } };
};
