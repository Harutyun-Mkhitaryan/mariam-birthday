import { prefersReducedMotion } from './motion';

/**
 * Letter typewriter.
 * – Every grapheme is laid out up-front (hidden), so the paper never reflows while typing.
 * – Starts once the letter frame has revealed (≈20% into the viewport), types once.
 * – "Show the whole letter" skips; "Type it again" (or following a link to #letter
 *   after it finished) replays.
 * – Screen readers get the full letter immediately via a visually-hidden copy.
 */
type State = 'idle' | 'typing' | 'done';

const segment = (text: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (Seg) return [...new Seg('hy', { granularity: 'grapheme' }).segment(text)].map((s) => s.segment);
  return Array.from(text);
};

export function initTypewriter(): void {
  const root = document.querySelector<HTMLElement>('[data-typewriter]');
  if (!root) return;
  const group = root.closest<HTMLElement>('[data-reveal-group]');
  const source = root.parentElement?.querySelector<HTMLScriptElement>('[data-letter-source]');
  const skipBtn = document.querySelector<HTMLButtonElement>('[data-typewriter-skip]');
  const replayBtn = document.querySelector<HTMLButtonElement>('[data-typewriter-replay]');

  let lines: string[];
  try {
    lines = JSON.parse(source?.textContent || '[]');
  } catch {
    return;
  }
  if (!lines.length) return;

  const cfg = {
    charDelay: Number(root.dataset.charDelay) || 36,
    jitter: Number(root.dataset.jitter) || 0,
    greetingPause: Number(root.dataset.greetingPause) || 350,
    linePause: Number(root.dataset.linePause) || 250,
    commaPause: Number(root.dataset.commaPause) || 80,
  };

  /* ── accessible copy ─────────────────────────────── */
  const sr = document.createElement('div');
  sr.className = 'sr-only';
  sr.lang = 'hy';
  lines.forEach((l) => {
    const p = document.createElement('p');
    p.textContent = l;
    sr.append(p);
  });
  root.after(sr);
  root.setAttribute('aria-hidden', 'true');

  /* ── build the typed layer ───────────────────────── */
  const chars: HTMLSpanElement[] = [];
  const lineEnds = new Set<number>();
  const wordEnds = new Set<number>();
  const frag = document.createDocumentFragment();

  lines.forEach((line, li) => {
    const p = document.createElement('p');
    p.className = li === 0 ? 'letter__greeting' : 'letter__line';
    // words keep their graphemes together; spaces stay real text so wrapping is natural
    line.split(/( +)/).forEach((part) => {
      if (!part) return;
      if (/^ +$/.test(part)) {
        p.append(document.createTextNode(part));
        return;
      }
      const word = document.createElement('span');
      word.className = 'tw-word';
      segment(part).forEach((g) => {
        const c = document.createElement('span');
        c.className = 'tw-c';
        c.textContent = g;
        word.append(c);
        chars.push(c);
      });
      wordEnds.add(chars.length - 1);
      p.append(word);
    });
    lineEnds.add(chars.length - 1);
    frag.append(p);
  });

  const firstLineEnd = [...lineEnds][0];
  const caret = document.createElement('span');
  caret.className = 'tw-caret';
  caret.setAttribute('aria-hidden', 'true');

  root.replaceChildren(frag);
  root.classList.add('is-armed');

  /* ── typing engine ───────────────────────────────── */
  let state: State = 'idle';
  let index = 0;
  let timer = 0;

  const placeCaret = (after: HTMLElement | null) => {
    if (after) after.after(caret);
    else root.querySelector('p')?.prepend(caret);
  };

  const setButtons = () => {
    if (skipBtn) skipBtn.hidden = state !== 'typing';
    if (replayBtn) replayBtn.hidden = state !== 'done';
  };

  const finish = () => {
    window.clearTimeout(timer);
    chars.forEach((c) => c.classList.add('is-typed'));
    index = chars.length;
    placeCaret(chars[chars.length - 1]);
    state = 'done';
    root.classList.remove('is-typing');
    root.classList.add('is-done');
    setButtons();
  };

  const delayAfter = (i: number): number => {
    const g = chars[i].textContent || '';
    let d = cfg.charDelay + (Math.random() * 2 - 1) * cfg.jitter;
    if (lineEnds.has(i)) d += i === firstLineEnd ? cfg.greetingPause : cfg.linePause;
    else if (g === ',') d += cfg.commaPause;
    else if (g === '։' || g === '.') d += cfg.commaPause * 2;
    // the space after a word costs a little time too
    else if (wordEnds.has(i)) d += cfg.charDelay * 0.6;
    return Math.max(12, d);
  };

  const step = () => {
    if (state !== 'typing') return;
    if (index >= chars.length) return finish();
    const c = chars[index];
    c.classList.add('is-typed');
    placeCaret(c);
    const d = delayAfter(index);
    index += 1;
    timer = window.setTimeout(step, d);
  };

  const reset = () => {
    window.clearTimeout(timer);
    chars.forEach((c) => c.classList.remove('is-typed'));
    index = 0;
    placeCaret(null);
    state = 'idle';
    root.classList.remove('is-done', 'is-typing');
    setButtons();
  };

  const start = (delay = 0) => {
    if (state === 'typing') return;
    if (prefersReducedMotion()) return finish();
    reset();
    state = 'typing';
    root.classList.add('is-typing');
    setButtons();
    timer = window.setTimeout(step, delay);
  };

  placeCaret(null);

  /* ── triggers ────────────────────────────────────── */
  if (prefersReducedMotion()) {
    finish();
  } else if (group && 'IntersectionObserver' in window) {
    if (group.classList.contains('is-inview')) start(550);
    else group.addEventListener('reveal', () => start(550), { once: true });
  } else {
    finish();
  }

  skipBtn?.addEventListener('click', () => {
    finish();
    replayBtn?.focus();
  });
  replayBtn?.addEventListener('click', () => {
    start(250);
    skipBtn?.focus();
  });

  // an intentional revisit (following a link to the letter) replays a finished letter
  document.querySelectorAll<HTMLAnchorElement>('a[href="#letter"]').forEach((a) =>
    a.addEventListener('click', () => {
      if (state === 'done') start(900);
    }),
  );
}
