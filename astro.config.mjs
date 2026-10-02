// @ts-check
import { defineConfig } from 'astro/config';
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* ──────────────────────────────────────────────────────────────────────────
 * Where is the site going to live?
 *
 * On GitHub Actions the address is worked out automatically from the repository:
 *   repo "<user>.github.io"  →  https://<user>.github.io/
 *   any other repo name      →  https://<user>.github.io/<repo>/
 * so nothing needs editing before pushing to GitHub.
 *
 * For a custom domain (or another host) set SITE_URL and BASE_PATH in the
 * environment, e.g.  SITE_URL=https://mariam.example  BASE_PATH=/
 *
 * A plain local `npm run build` has no fixed address, so it produces a
 * "portable" dist/ with relative links that works from any folder on any host.
 * ────────────────────────────────────────────────────────────────────────── */
const owner = process.env.GITHUB_REPOSITORY_OWNER?.toLowerCase();
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const onGitHub = Boolean(process.env.GITHUB_ACTIONS && owner && repo);
const isUserSite = repo?.toLowerCase() === `${owner}.github.io`;

const site = process.env.SITE_URL ?? (onGitHub ? `https://${owner}.github.io` : undefined);
const base = process.env.BASE_PATH ?? (onGitHub && !isUserSite ? `/${repo}` : '/');
const portable = !site;

/**
 * 1. The source PNGs in src/assets are the untouched originals from the design
 *    package. Astro emits every imported original next to the optimised
 *    AVIF/WebP renditions; this removes the originals nothing references, so
 *    the deployed site only ships the optimised files.
 * 2. For portable builds, rewrites root-absolute links ("/assets/…") to
 *    relative ones ("./assets/…").
 */
const finishBuild = () => ({
  name: 'finish-build',
  hooks: {
    /** @param {{ dir: URL, logger: import('astro').AstroIntegrationLogger }} ctx */
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      const assetsDir = path.join(root, 'assets');

      /** @type {string[]} */
      const textFiles = [];
      /** @param {string} d */
      const walk = async (d) => {
        for (const e of await readdir(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) await walk(p);
          else if (/\.(html|css|js|json|webmanifest|xml)$/.test(e.name)) textFiles.push(p);
        }
      };
      await walk(root);
      const corpus = (await Promise.all(textFiles.map((f) => readFile(f, 'utf8')))).join('\n');

      let removed = 0;
      for (const file of await readdir(assetsDir)) {
        if (!/\.(png|jpe?g)$/i.test(file)) continue;
        if (!corpus.includes(file)) {
          await rm(path.join(assetsDir, file));
          removed++;
        }
      }
      logger.info(`removed ${removed} unreferenced original image(s)`);

      if (portable) {
        let links = 0;
        for (const file of textFiles.filter((f) => f.endsWith('.html'))) {
          const html = await readFile(file, 'utf8');
          const out = html
            // src / href / poster / data-* values and every entry of a srcset
            .replace(/(["\s,])\/(assets|video)\//g, (_, pre, dirName) => (links++, `${pre}./${dirName}/`))
            .replace(/(href|content)="\/([\w.-]+\.(?:png|jpg|svg|ico|webmanifest))"/g, (_, attr, f) => (links++, `${attr}="./${f}"`));
          await writeFile(file, out);
        }
        logger.info(`portable build: ${links} links made relative`);
      } else {
        logger.info(`built for ${site}${base === '/' ? '' : base}/`);
      }
    },
  },
});

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site,
  base,
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  compressHTML: true,
  integrations: [finishBuild()],
});
