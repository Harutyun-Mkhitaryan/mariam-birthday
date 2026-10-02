/**
 * Central content + configuration for the page.
 * Copy is taken verbatim from the 1440 / 390 mockups
 * (08-Desktop/Mariam-Birthday-Desktop-1440.svg, 09-Mobile/Mariam-Birthday-Mobile-390.svg).
 */

export const site = {
  title: 'Happy Birthday, Mariam',
  description:
    'A special day for a special soul — a letter, a video greeting and precious memories for Mariam.',
  lang: 'en',
  themeColor: '#0B0806',
} as const;

export type NavItem = { id: string; label: string; href: `#${string}` };

/** Anchor navigation (header, mobile menu, footer). Targets follow 10-Prototype/prototype-flow.json */
export const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'letter', label: 'Letter', href: '#letter' },
  { id: 'video', label: 'Video', href: '#video' },
  { id: 'memories', label: 'Memories', href: '#memories' },
  { id: 'wishes', label: 'Wishes', href: '#wishes' },
];

/** "Send Wishes" scrolls to the Final Wishes section (prototype-flow.json). */
export const sendWishesHref = '#wishes' as const;

export const hero = {
  eyebrow: ['A special day', 'for a special soul'],
  titleLines: ['Happy', 'Birthday,'],
  name: 'Mariam',
  intro: 'May your day be as beautiful, inspiring and special as the art you create.',
  cta: 'Send wishes',
  index: [
    { n: '01', label: 'Letter', href: '#letter' },
    { n: '02', label: 'Video', href: '#video' },
    { n: '03', label: 'Memories', href: '#memories' },
    { n: '04', label: 'Wishes', href: '#wishes' },
  ],
} as const;

export const letterSection = {
  titleLines: ['A Letter', 'For You'],
  eyebrow: ['Some words', 'from the heart'],
} as const;

export const memoriesSection = {
  titleLines: ['Precious', 'Memories'],
  eyebrow: ['Beautiful moments', 'that make life', 'extra special'],
  moreLabel: 'View full gallery',
  lessLabel: 'Show fewer memories',
} as const;

export const wishes = {
  titleLines: ['Always', 'Keep Creating'],
  eyebrow: ['A final wish', 'from my heart'],
  /** desktop / tablet copy (1440 mockup line breaks) */
  body: [
    'May this new chapter bring you endless inspiration,',
    'happiness and success in everything you do.',
    'Keep creating, keep dreaming, and keep being',
    'the wonderful person you are.',
  ],
  /** shorter phone copy from the 390 mockup */
  bodyMobile: [
    'May this new chapter bring you',
    'endless inspiration, happiness',
    'and success in everything you do.',
    'Keep creating and keep dreaming.',
  ],
  signature: ['Happy Birthday,', 'Mariam'],
} as const;

export const footer = {
  credit: ['Made with love', 'for Mariam'],
} as const;

/* ------------------------------------------------------------------ */
/*  VIDEO                                                              */
/* ------------------------------------------------------------------ */
/**
 * The birthday film (33 s, H.264 + AAC, "fast start" so it streams while loading).
 *
 *   src      – the main file. 1080p / 3.7 Mbps / 15 MB: sharp on desktop and in
 *              fullscreen, and far below GitHub's 100 MB per-file limit.
 *   srcLite  – the 720p / 0.8 Mbps / 3 MB version. The player switches to it
 *              automatically when the visitor is on a slow connection or has
 *              data-saver on, and as a fallback if the main file fails to load.
 *
 * Both live in /public/video/. To swap the film later, replace the files (or
 * change the paths here). Paths starting with "/" are resolved against the
 * site's base path, so they work on GitHub Pages project sites too.
 *
 * Alternatives: set `embedUrl` (YouTube / Vimeo) instead of `src`; with both
 * empty the player shows a placeholder.
 */
export type VideoConfig = {
  src: string;
  srcLite: string;
  type: string;
  captions: string;
  captionsLang: string;
  captionsLabel: string;
  embedUrl: string;
  title: string;
};

export const video: VideoConfig = {
  src: '/video/mariam-birthday-1080p.mp4',
  srcLite: '/video/mariam-birthday-720p.mp4',
  type: 'video/mp4',
  captions: '',
  captionsLang: 'hy',
  captionsLabel: 'Հայերեն',
  embedUrl: '',
  title: 'A birthday video greeting for Mariam',
};

export const videoSection = {
  titleLines: ['A Special', 'Video For You'],
  body: [
    'A small video filled with love,',
    'beautiful moments and warm wishes',
    '— made especially for her.',
  ],
  cta: 'Watch video',
  placeholder: {
    title: 'The video is on its way',
    body: 'A little film of wishes is being prepared for this spot. Come back soon.',
  },
} as const;
