/**
 * Page intro: wait (briefly) for the web fonts so the script-name mask reveal
 * doesn't run on a fallback face, then flag the document as loaded.
 */
export function initIntro(): void {
  const root = document.documentElement;
  const go = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  const timeout = new Promise((r) => setTimeout(r, 600));
  Promise.race([fonts ? fonts.ready : Promise.resolve(), timeout]).then(go, go);
}
