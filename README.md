# Happy Birthday, Mariam — landing page

A cinematic one-page birthday site built from the approved design package
**Mariam-Birthday-Final-Assembly** (1440 px desktop and 390 px mobile mockups, tokens, assets and animation spec),
with the final gallery illustrations and birthday film.

- **Stack:** Astro 7 + TypeScript, plain CSS with design tokens, about 10 KB of client JS, no animation libraries
- **Sections:** Header, Hero, Letter (Armenian typewriter), Video greeting, Memories gallery, Final wishes, Footer
- **Images:** the original PNGs live in `src/assets/` untouched. At build time they become responsive AVIF (with a WebP fallback).

---

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

The first build encodes every image and takes a few minutes. Later builds use the cache.

### Deploy to GitHub Pages

**Live site:** https://harutyun-mkhitaryan.github.io/mariam-birthday/

The built site is published from the **`gh-pages`** branch (Settings → Pages → Deploy from a branch);
`main` holds this source. To update the live site, rebuild with
`SITE_URL=https://harutyun-mkhitaryan.github.io` and `BASE_PATH=/mariam-birthday`, then replace the
contents of `gh-pages` with the new `dist/`. Details (in Russian) are in **`DEPLOY-GITHUB-PAGES.md`**.

Optional: for automatic rebuilds on every push, move `deploy.yml` to `.github/workflows/deploy.yml`
and switch Pages to **Source: GitHub Actions**.

- The site address is detected automatically on GitHub (`https://<user>.github.io/<repo>/`), so
  nothing in `astro.config.mjs` needs editing. For a custom domain set `SITE_URL` and `BASE_PATH`
  in the workflow.
- A local `npm run build` makes a **portable** `dist/`: all links are relative, so the folder works
  from any address or sub-folder on any static host. Link-preview (Open Graph) image tags are only
  added in the GitHub build, where the final address is known.
- Opening `dist/index.html` straight from disk (`file://`) won't work, because browsers block module
  scripts there. Use `npm run preview` or any static server.

---

## The video

The film is self-hosted in `public/video/` and configured in **`src/data/site.ts` → `video`**:

```ts
export const video = {
  src: '/video/mariam-birthday-1080p.mp4',     // main file: 1080p, 15 MB
  srcLite: '/video/mariam-birthday-720p.mp4',  // light file: 720p, 3 MB
  type: 'video/mp4',
  captions: '',        // optional WebVTT file, e.g. '/video/captions.vtt'
  captionsLang: 'hy',
  captionsLabel: 'Հայերեն',
  embedUrl: '',        // or a YouTube / Vimeo embed URL instead of src
  title: 'A birthday video greeting for Mariam',
};
```

- **1080p is the default.** At 3.7 Mbps it streams smoothly on ordinary connections and stays sharp
  in fullscreen. The 720p file is used automatically on slow or data-saver connections, and as a
  fallback if the main file can't be loaded.
- Nothing is downloaded until a visitor presses play. Playback never starts on page load.
- Both files are H.264 + AAC with the index at the start of the file ("fast start"), so they play in
  every current browser and begin before the download finishes.
- To replace the film, overwrite the two files (or change the paths above). To refresh the frame shown
  while it loads, replace `src/assets/video/film-first-frame.png`.

---

## Where things live

```
src/
  data/
    site.ts        nav, copy for every section, video config
    letter.ts      the Armenian letter (exact text) + typewriter timing
    memories.ts    gallery items, alt text, captions, grid placement
  components/      Header, Hero, LetterSection, VideoSection, MemoriesSection,
                   MemoryCard, FinalWishes, Footer, SectionTitle, Button, Logo, Icon,
                   Img (responsive <picture>), ArtPicture (art-directed hero)
  scripts/         header, hero (parallax), intro, reveal, typewriter, video, gallery, motion helpers
  styles/
    tokens.css     colours/fonts/spacing from 01-Design-System + type scale + motion tokens
    tokens.source.css / tokens.json   original token files, unchanged
    base.css, motion.css, header.css, hero.css, letter.css, sections.css
  assets/          original PNGs (see ASSETS.md for the mapping)
public/            favicon, apple-touch icon, OG image, /video (the two film files)
deploy.yml         GitHub Pages workflow — move to .github/workflows/ before publishing
```

---

## Design notes and decisions

- **Fidelity:** Every section is laid out from the coordinates in `Mariam-Birthday-Desktop-1440.svg`
  and `Mariam-Birthday-Mobile-390.svg`. Baselines, frames, gutters and the 250 / 270 / 300 gallery grid
  all match. Between the two reference frames, type and spacing scale fluidly.
- **Section titles** use the design-system H2 token (56 px, −0.4 letter-spacing) instead of the 60 px drawn in the
  mockup. At 60 px, "Video For You" runs into the video poster in the original SVG. 56 px keeps the same look without the collision.
- **Letter:** Cormorant Garamond has no Armenian glyphs, so the letter is set in **Noto Serif Armenian**,
  the closest classical serif with Armenian support, in the paper-ink colour. The text is real HTML. It is pinned
  to the sheet in the photograph (and rotated to match its angle) through a "view window" into the image, so it stays on the
  paper at every width. Typing never reflows the page, because every glyph is laid out before typing starts. Screen readers
  get the full letter at once. It was checked with no overflow at widths from 320 to 2560 px.
- **Typewriter:** 36 ms per character (±8 ms jitter), a 350 ms pause after the greeting, 260 ms between lines,
  and short pauses at commas and full stops. It starts once the section is about 20 % into view and types once. "Show the whole letter"
  skips ahead, and "Type it again" (or following a link to the letter after it has finished) replays it.
- **Gallery:** the seven illustrations of Mariam. Six fill the designed grid; "View full gallery" (from the
  mobile mockup) reveals the seventh as a wide panorama. All seven are tall portraits, so each card crops
  to its slot around the face (`focus` / `focusMobile` in `src/data/memories.ts`). Every card opens a
  lightbox with the whole picture; it works with the keyboard, arrow keys and swipe.
- **Video poster:** the section keeps the approved sunset poster with a 15 % overlay that lightens on hover.
  The player itself shows the film's first frame while loading.
- **Mobile final wishes** uses the shorter copy from the 390 mockup. Desktop and tablet use the 1440 copy.
- **Motion** follows `11-Animation-Spec.md`. With `prefers-reduced-motion`, zoom, parallax, pulses and particles are off,
  transitions are 150 ms or shorter, and the letter appears complete.
- **Accessibility:** semantic landmarks and headings (h1, then h2 per section), a skip link, visible focus rings,
  native `<dialog>` for the menu, video and lightbox (focus is trapped, Esc closes, focus returns to the opener), descriptive
  alt text, and `lang="hy"` on the letter. axe-core reports 0 violations at 1440 and 390 px.
- **No JavaScript?** Every section still renders, with the full letter and all seven memories shown, and
  "Watch video" links straight to the film file.
- `<meta name="robots" content="noindex">` is set because this is a personal page. Remove it from
  `src/layouts/BaseLayout.astro` if you want search engines to index the page.
