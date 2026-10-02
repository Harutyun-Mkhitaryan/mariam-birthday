import { animatedDialog } from './motion';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Video greeting: poster + play button open a modal player.
 * – Playback only ever starts from the visitor's own click — never on load.
 * – Nothing is downloaded until the player is opened.
 * – The 1080p file is the default; the light 720p file is used on slow /
 *   data-saver connections and as a fallback if the main file fails.
 */
export function initVideo(): void {
  const modal = document.querySelector<HTMLDialogElement>('[data-video-modal]');
  if (!modal || typeof modal.showModal !== 'function') return;

  const player = modal.querySelector<HTMLVideoElement>('[data-video-player]');
  const embedHost = modal.querySelector<HTMLElement>('[data-video-embed]');

  /* ── source selection ───────────────────────────── */
  const pickSource = (): string => {
    const main = player?.dataset.src || '';
    const lite = player?.dataset.srcLite || '';
    if (!lite) return main;
    // Only the browser's coarse verdict is trusted here. The raw `downlink` figure is
    // too noisy to act on: it reported 1.6 Mbps on a line that fetched at 13 Mbps.
    const net = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow = !!net && (net.saveData === true || ['slow-2g', '2g', '3g'].includes(net.effectiveType || ''));
    return slow ? lite : main;
  };

  const loadSource = () => {
    if (!player || player.dataset.loaded) return;
    player.dataset.loaded = 'true';
    player.preload = 'auto';
    player.src = pickSource();
    // one automatic retry with the light file if the chosen one can't be played
    player.addEventListener(
      'error',
      () => {
        const lite = player.dataset.srcLite;
        if (!lite || new URL(lite, location.href).href === player.src) return;
        const at = player.currentTime;
        player.src = lite;
        player.addEventListener('loadedmetadata', () => (player.currentTime = at), { once: true });
        void player.play().catch(() => {});
      },
      { once: true },
    );
  };

  const mountEmbed = () => {
    if (!embedHost || embedHost.querySelector('iframe')) return;
    const url = new URL(embedHost.dataset.videoEmbed!, location.href);
    url.searchParams.set('autoplay', '1');
    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.title = embedHost.dataset.videoTitle || 'Video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    embedHost.append(iframe);
  };

  const dlg = animatedDialog(modal, {
    onOpen: () => {
      if (player) {
        loadSource();
        player.play().catch(() => {
          /* the visitor can press play in the native controls */
        });
        player.focus({ preventScroll: true });
      }
      mountEmbed();
    },
    onClose: () => {
      player?.pause();
      embedHost?.replaceChildren();
    },
  });

  document.querySelectorAll<HTMLElement>('[data-video-open]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // the CTA is a real link to the file when JS is off
      dlg.open(btn);
    }),
  );
  modal.querySelector('[data-video-close]')?.addEventListener('click', () => void dlg.close());

  // when the film ends, rewind so a second "play" starts from the beginning
  player?.addEventListener('ended', () => {
    player.currentTime = 0;
  });
}
