/**
 * Screenshots Playwright des pages guide en mode comparatif :
 *   ref Lovable (port 5174) vs guide local (port 5175).
 *
 * Sortie : /tmp/pixel-diff/{page}-{site}-{viewport}.png
 *
 * Usage : pnpm exec tsx scripts/pixel-diff.ts
 */

import { chromium } from "@playwright/test";
import fs from "node:fs";

const REF = "http://localhost:5174";
const GUIDE = "http://localhost:5175";
const OUTDIR = "/tmp/pixel-diff";

const PAGES = [
  { name: "login", ref: "/", guide: "/fr/au-bon-coeur/" },
  { name: "guide-access", ref: "/acces", guide: "/fr/" },
  { name: "guide-home", ref: "/guide", guide: "/fr/au-bon-coeur/guide/" },
  { name: "notfound", ref: "/page-bidon", guide: "/fr/url-bidon/" },
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

async function main() {
  if (fs.existsSync(OUTDIR)) fs.rmSync(OUTDIR, { recursive: true });
  fs.mkdirSync(OUTDIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // Pour le guide, on doit set le slug en localStorage avant /guide
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: "fr-FR",
    });
    // Pré-set localStorage pour le guide
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("cosyhome-slug", "au-bon-coeur");
        localStorage.setItem("cosyhome-slug-expiry", String(Date.now() + 86400000 * 3));
      } catch {}
    });
    const page = await ctx.newPage();

    for (const p of PAGES) {
      for (const [site, base, path] of [
        ["ref", REF, p.ref],
        ["guide", GUIDE, p.guide],
      ] as const) {
        try {
          const url = `${base}${path}`;
          await page.goto(url, { waitUntil: "networkidle", timeout: 15_000 }).catch(() => {});
          await page.waitForTimeout(1200);
          const out = `${OUTDIR}/${p.name}-${site}-${vp.name}.png`;
          await page.screenshot({ path: out, fullPage: true });
          console.log(`✓ ${p.name}-${site}-${vp.name}: ${url}`);
        } catch (err) {
          console.log(`✗ ${p.name}-${site}-${vp.name}: ${err}`);
        }
      }
    }

    await ctx.close();
  }

  await browser.close();
  console.log(`\nScreenshots : ${OUTDIR}/`);
  console.log("Compare visuellement par paires (ref vs guide) pour chaque page+viewport.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
