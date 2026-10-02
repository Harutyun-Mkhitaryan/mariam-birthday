# Asset map

Backgrounds, hero, decor and brand files in `src/assets/` are unmodified copies of files from the design package
(only the file names changed to ASCII). The gallery and film are the final files supplied afterwards.
The build makes the optimised AVIF/WebP versions and ships nothing else.

| Project file | Package source | Used in |
|---|---|---|
| `hero/hero-desktop.png` | `05-Backgrounds/роскошный_букет_ко_дню_рождения_мариам.png` (hero_desktop) | Hero ≥ 768 px |
| `hero/hero-mobile.png` | `05-Backgrounds/роскошный_букет_при_свечах.png` (hero_mobile) | Hero < 768 px |
| `backgrounds/letter-paper.png` | `05-Backgrounds/винтажное_письмо_при_свечах_и_цветах.png` (letter) | Letter sheet |
| `backgrounds/video-poster.png` | `05-Backgrounds/закат_на_террасе_художницы.png` (video) | Video section poster |
| `backgrounds/final-wishes.png` | `05-Backgrounds/романтический_цветочный_фон_при_свечах.png` (final_bg) | Final wishes background |
| `decor/sparkle.png` | `04-Decorative-Assets/золотое_мерцание_на_прозрачном_фоне.png` | Hero shimmer (18 %) |
| `decor/champagne-corner.png` | `04-Decorative-Assets/шампанский_цветочный_уголок.png` | Letter corner (22 %), mobile menu |
| `decor/petals.png` | `04-Decorative-Assets/россыпь_золотых_лепестков_и_цветов.png` | Petals over the video (12 %) |
| `decor/floral-branch.png` | `04-Decorative-Assets/золотистая_цветочная_ветвь_с_кремовыми_цветами.png` | Memories branch (22 %) |
| `brand/monogram-floral.png` | `02-Brand/роскошная_золотая_монограмма_m_с_цветами.png` | Favicon / touch icon source |

## Gallery (`src/assets/gallery/`, 1122 × 1402 each)

| File | Scene | Slot |
|---|---|---|
| `tea-in-the-studio.png` | Tea at the studio table, sunset painting behind | 1 |
| `at-the-easel.png` | Painting the sunset city at the easel | 2 |
| `glowing-heart.png` | Beside the glowing glass heart | 3 |
| `gift.png` | Leaning over the gift with the satin bow | 4 |
| `candlelit-evening.png` | Lace blouse, candles, books and pearls | 5 |
| `bouquet.png` | Sitting with the bouquet of peach roses | 6 |
| `terrace-sketch.png` | Sketching on the terrace at sunset | 7 (full gallery, wide) |

## Film

| File | Details |
|---|---|
| `public/video/mariam-birthday-1080p.mp4` | 1920 × 1080, 33 s, H.264 + AAC, 15 MB (default) |
| `public/video/mariam-birthday-720p.mp4` | 1280 × 720, 33 s, H.264 + AAC, 3 MB (slow connections, fallback) |
| `src/assets/video/film-first-frame.png` | First frame of the film, shown in the player while it loads |

Other sources:

- **Icons:** the paths from `03-Icons/*.svg` are inlined in `src/components/Icon.astro` and use `currentColor`.
- **Header / footer monogram:** the Cormorant "M" and gold quill flourish from the mockup header (`Logo.astro`).
- **Tokens:** `01-Design-System/tokens.css` and `tokens.json` are kept verbatim in `src/styles/`.
- `public/og-image.jpg` is a 1200 × 630 crop of the hero image. The favicon and apple-touch icon are made from the floral monogram.

Not used: the nine placeholder gallery images from `06-Gallery-Images` (replaced by the illustrations above),
the memories collage background, the frame, divider, bow, vortex, bokeh and candle sprite sheets,
and the combined concept mockup in `13-Source-Library`.
