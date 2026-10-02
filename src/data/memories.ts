import type { ImageMetadata } from 'astro';

import teaInTheStudio from '../assets/gallery/tea-in-the-studio.png';
import atTheEasel from '../assets/gallery/at-the-easel.png';
import glowingHeart from '../assets/gallery/glowing-heart.png';
import gift from '../assets/gallery/gift.png';
import candlelitEvening from '../assets/gallery/candlelit-evening.png';
import bouquet from '../assets/gallery/bouquet.png';
import terraceSketch from '../assets/gallery/terrace-sketch.png';

/**
 * Placement is taken from the mockups (gallery frame origin = first card):
 *  – desktop (1440): 3 columns 250 / 270 / 300 px, 20 px gutters, 860 × 610 px block
 *  – mobile  (390):  2 columns 166 / 166 px, 18 px gutters, some cards span both columns
 *
 * desktop.col / desktop.row are CSS grid lines inside the 860 × 610 block
 * (row lines at 0, 225, 250, 270, 290, 330, 350, 610 px — see sections.css).
 *
 * All seven illustrations are 1122 × 1402 portraits, so every card crops them.
 * `focus` / `focusMobile` are object-position values that keep the face (and the
 * main prop) inside each slot's crop.
 */
export type Memory = {
  id: string;
  image: ImageMetadata;
  alt: string;
  caption: string;
  /** initial grid (true) or revealed by "View full gallery" (false) */
  featured: boolean;
  desktop: { col: string; row: string };
  mobile: { span: 1 | 2; ratio: string };
  /** object-position for the crop (desktop / tablet) */
  focus?: string;
  /** object-position below 768 px, when the slot shape differs */
  focusMobile?: string;
  /** full-width panorama card — needs larger renditions */
  wide?: boolean;
};

export const memories: Memory[] = [
  {
    id: 'tea-in-the-studio',
    image: teaInTheStudio,
    alt: 'Illustration: a young woman with long dark hair rests her cheek on her hand over a floral teacup in a candlelit studio, a sunset painting on the easel behind her.',
    caption: 'Tea in the studio',
    featured: true,
    desktop: { col: '1', row: '1 / 4' },
    mobile: { span: 1, ratio: '166 / 260' },
    focus: '52% 38%',
  },
  {
    id: 'at-the-easel',
    image: atTheEasel,
    alt: 'Illustration: she sits at an easel with a palette, painting the sunset city seen through the studio window.',
    caption: 'Painting the sunset',
    featured: true,
    desktop: { col: '2', row: '1 / 6' },
    mobile: { span: 1, ratio: '166 / 260' },
    focus: '38% 50%',
  },
  {
    id: 'glowing-heart',
    image: glowingHeart,
    alt: 'Illustration: she smiles beside a glowing glass heart surrounded by roses, pearls and candles.',
    caption: 'A glowing heart',
    featured: true,
    desktop: { col: '3', row: '1 / 2' },
    mobile: { span: 2, ratio: '350 / 225' },
    focus: '50% 13%',
    focusMobile: '50% 15%',
  },
  {
    id: 'gift',
    image: gift,
    alt: 'Illustration: she leans over a dark gift box tied with a wide bronze satin bow and topped with blossoms.',
    caption: 'A gift tied with satin',
    featured: true,
    desktop: { col: '1', row: '5 / 8' },
    mobile: { span: 1, ratio: '166 / 280' },
    focus: '45% 50%',
  },
  {
    id: 'candlelit-evening',
    image: candlelitEvening,
    alt: 'Illustration: in a cream lace blouse she daydreams at a table of candles, roses, old books, pearls and a teacup.',
    caption: 'An evening by candlelight',
    featured: true,
    desktop: { col: '2', row: '7 / 8' },
    mobile: { span: 1, ratio: '166 / 280' },
    focus: '78% 30%',
  },
  {
    id: 'bouquet',
    image: bouquet,
    alt: 'Illustration: she sits among candles and gifts holding a large bouquet of peach roses and white blossoms.',
    caption: 'Flowers for you',
    featured: true,
    desktop: { col: '3', row: '3 / 8' },
    mobile: { span: 2, ratio: '350 / 270' },
    focus: '50% 16%',
  },
  {
    id: 'terrace-sketch',
    image: terraceSketch,
    alt: 'Illustration: on a blossoming terrace at sunset she paints the old city in a watercolour sketchbook.',
    caption: 'Sketching the city at sunset',
    featured: false,
    desktop: { col: '1 / -1', row: '1' },
    mobile: { span: 2, ratio: '350 / 270' },
    focus: '50% 20%',
    focusMobile: '50% 31%',
    wide: true,
  },
];
