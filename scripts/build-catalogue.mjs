/* ==========================================================
   Catalogue builder
   ----------------------------------------------------------
   Builds public/data/catalogue.json and downloads bottle photos to
   public/images/products/<fragranticaId>.jpg.

   Source: each brand's listing page on Fragrantica. Fragrances that
   Fragrantica marks as discontinued are skipped. Pages are cached in
   .cache/designers; delete a file there to refresh that brand.

   Usage:
     npm run catalogue              # build data + download missing photos
     npm run catalogue -- --no-images

   To add a brand: add a line to BRANDS below and rerun.
   ========================================================== */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CURATED } from "../src/data/curated.js";
import { BODY_CARE } from "../src/data/bodycare.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, ".cache/designers");
const IMG_DIR = path.join(ROOT, "public/images/products");
const OUT = path.join(ROOT, "public/data/catalogue.json");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

// Max fragrances per brand, most popular first (by Fragrantica review count).
// Set to Infinity to list every in-production fragrance.
const MAX_PER_BRAND = Infinity;

/* name: shown on site · src: Fragrantica designer page · cat: designer | niche | arabian
   only: optional regex to keep only some lines · aka: extra search keywords */
const BRANDS = [
  // Designer houses
  { name: "Dior", src: "Dior", origin: "Paris", cat: "designer" },
  { name: "Chanel", src: "Chanel", origin: "Paris", cat: "designer" },
  { name: "Giorgio Armani", src: "Giorgio-Armani", origin: "Milan", cat: "designer", aka: "Armani Emporio" },
  { name: "Versace", src: "Versace", origin: "Milan", cat: "designer" },
  { name: "Yves Saint Laurent", src: "Yves-Saint-Laurent", origin: "Paris", cat: "designer", aka: "YSL" },
  { name: "Guerlain", src: "Guerlain", origin: "Paris", cat: "designer" },
  { name: "Tom Ford", src: "Tom-Ford", origin: "New York", cat: "designer" },
  { name: "Gucci", src: "Gucci", origin: "Florence", cat: "designer" },
  { name: "Bvlgari", src: "Bvlgari", origin: "Rome", cat: "designer", aka: "Bulgari" },
  { name: "Dolce & Gabbana", src: "Dolce-Gabbana", origin: "Milan", cat: "designer", aka: "D&G Dolce and Gabbana" },
  { name: "Cartier", src: "Cartier", origin: "Paris", cat: "designer" },
  { name: "Burberry", src: "Burberry", origin: "London", cat: "designer" },
  { name: "Issey Miyake", src: "Issey-Miyake", origin: "Tokyo", cat: "designer" },
  { name: "Rabanne", src: "Rabanne", origin: "Paris", cat: "designer", aka: "Paco Rabanne" },
  { name: "Carolina Herrera", src: "Carolina-Herrera", origin: "New York", cat: "designer" },
  { name: "Jean Paul Gaultier", src: "Jean-Paul-Gaultier", origin: "Paris", cat: "designer", aka: "JPG Gautier" },
  { name: "Maison Margiela", src: "Maison-Martin-Margiela", origin: "Paris", cat: "designer", aka: "Replica" },
  { name: "Montblanc", src: "Montblanc", origin: "Hamburg", cat: "designer", aka: "Mont Blanc" },
  { name: "Salvatore Ferragamo", src: "Salvatore-Ferragamo", origin: "Florence", cat: "designer", aka: "Ferragamo" },
  { name: "Azzaro", src: "Azzaro", origin: "Paris", cat: "designer" },
  { name: "Kenzo", src: "Kenzo", origin: "Paris", cat: "designer" },
  { name: "Rochas", src: "Rochas", origin: "Paris", cat: "designer" },
  { name: "Roberto Cavalli", src: "Roberto-Cavalli", origin: "Florence", cat: "designer" },
  { name: "Moschino", src: "Moschino", origin: "Milan", cat: "designer" },
  { name: "Marc Jacobs", src: "Marc-Jacobs", origin: "New York", cat: "designer" },
  { name: "Michael Kors", src: "Michael-Kors", origin: "New York", cat: "designer" },
  { name: "Tommy Hilfiger", src: "Tommy-Hilfiger", origin: "New York", cat: "designer" },
  { name: "John Varvatos", src: "John-Varvatos", origin: "New York", cat: "designer" },
  { name: "Nautica", src: "Nautica", origin: "New York", cat: "designer", aka: "Voyage" },
  { name: "Guess", src: "Guess", origin: "Los Angeles", cat: "designer" },
  { name: "Juicy Couture", src: "Juicy-Couture", origin: "Los Angeles", cat: "designer" },
  { name: "Jennifer Lopez", src: "Jennifer-Lopez", origin: "New York", cat: "designer", aka: "JLo J.Lo" },
  { name: "Victoria's Secret", src: "Victoria-s-Secret", origin: "New York", cat: "designer", aka: "Victorias Secret VS" },
  { name: "Bath & Body Works", src: "Bath-Body-Works", origin: "Columbus", cat: "designer", aka: "Bath and Body Works BBW", defaultType: "Body Mist" },
  { name: "Valentino", src: "Valentino", origin: "Rome", cat: "designer" },
  { name: "Lancôme", src: "Lancome", origin: "Paris", cat: "designer", aka: "Lancome" },
  { name: "Mugler", src: "Mugler", origin: "Paris", cat: "designer", aka: "Thierry Mugler" },
  { name: "Prada", src: "Prada", origin: "Milan", cat: "designer" },
  { name: "Lacoste", src: "Lacoste-Fragrances", origin: "Paris", cat: "designer" },
  { name: "Coach", src: "Coach", origin: "New York", cat: "designer" },
  { name: "Calvin Klein", src: "Calvin-Klein", origin: "New York", cat: "designer", aka: "CK" },
  { name: "Bentley", src: "Bentley", origin: "England", cat: "designer" },
  { name: "Jimmy Choo", src: "Jimmy-Choo", origin: "London", cat: "designer" },
  { name: "Dunhill", src: "Alfred-Dunhill", origin: "London", cat: "designer", aka: "Alfred Dunhill" },
  { name: "Hugo Boss", src: "Hugo-Boss", origin: "Metzingen", cat: "designer", aka: "Boss Hugo" },
  { name: "Narciso Rodriguez", src: "Narciso-Rodriguez", origin: "New York", cat: "designer" },
  { name: "Clinique", src: "Clinique", origin: "New York", cat: "designer", only: /happy/i },
  { name: "Joop!", src: "Joop", origin: "Hamburg", cat: "designer", aka: "Joop" },
  { name: "Baldessarini", src: "Baldessarini", origin: "Munich", cat: "designer" },
  { name: "Mercedes-Benz", src: "Mercedes-Benz", origin: "Stuttgart", cat: "designer", aka: "Mercedes Benz" },
  { name: "Cerruti", src: "Cerruti", origin: "Paris", cat: "designer" },
  { name: "Missoni", src: "Missoni", origin: "Milan", cat: "designer" },
  { name: "Laura Biagiotti", src: "Laura-Biagiotti", origin: "Rome", cat: "designer" },
  { name: "Grès", src: "Gres", origin: "Paris", cat: "designer", aka: "Gres Paris" },
  { name: "Guy Laroche", src: "Guy-Laroche", origin: "Paris", cat: "designer" },
  { name: "Mauboussin", src: "Mauboussin", origin: "Paris", cat: "designer" },
  { name: "Korloff", src: "Korloff-Paris", origin: "Paris", cat: "designer", aka: "Korloff Paris" },
  { name: "Franck Olivier", src: "Franck-Olivier", origin: "Paris", cat: "designer", aka: "Frank Olivier" },

  // Niche houses
  { name: "Creed", src: "Creed", origin: "Paris", cat: "niche" },
  { name: "Amouage", src: "Amouage", origin: "Muscat", cat: "niche" },
  { name: "Clive Christian", src: "Clive-Christian", origin: "London", cat: "niche" },
  { name: "Xerjoff", src: "Xerjoff", origin: "Turin", cat: "niche" },
  { name: "Maison Francis Kurkdjian", src: "Maison-Francis-Kurkdjian", origin: "Paris", cat: "niche", aka: "MFK Baccarat" },
  { name: "Parfums de Marly", src: "Parfums-de-Marly", origin: "Paris", cat: "niche", aka: "PDM" },
  { name: "Initio", src: "Initio-Parfums-Prives", origin: "Paris", cat: "niche", aka: "Initio Parfums Prives" },
  { name: "Nishane", src: "Nishane", origin: "Istanbul", cat: "niche" },
  { name: "Memo Paris", src: "Memo-Paris", origin: "Paris", cat: "niche", aka: "Memo" },
  { name: "Montale", src: "Montale", origin: "Paris", cat: "niche" },
  { name: "Mancera", src: "Mancera", origin: "Paris", cat: "niche", aka: "Mangera" },
  { name: "Alexandre.J", src: "Alexandre-J", origin: "Paris", cat: "niche", aka: "Alexandre J" },
  { name: "Giardini di Toscana", src: "Giardini-Di-Toscana", origin: "Tuscany", cat: "niche", aka: "Bianco Latte" },

  // Arabian perfumery
  { name: "Afnan", src: "Afnan", origin: "Dubai", cat: "arabian" },
  { name: "Lattafa", src: "Lattafa-Perfumes", origin: "Dubai", cat: "arabian" },
  { name: "Rasasi", src: "Rasasi", origin: "Dubai", cat: "arabian" },
  { name: "Ajmal", src: "Ajmal", origin: "Dubai", cat: "arabian" },
  { name: "Swiss Arabian", src: "Swiss-Arabian", origin: "Dubai", cat: "arabian" },
  { name: "Rayhaan", src: "Rayhaan", origin: "UAE", cat: "arabian", aka: "Rayhan" },
  { name: "Assaf", src: "Assaf", origin: "", cat: "arabian" },
  { name: "Khadlaj", src: "Khadlaj-Perfumes", origin: "Dubai", cat: "arabian", aka: "Khadlaj Perfumes" },
  { name: "Ibraheem Al Qurashi", src: "Ibraheem-Alqurashi", origin: "Saudi Arabia", cat: "arabian", aka: "Ibrahim Al Qurashi Alqurashi Qurashi" },
];

/* ---------- helpers ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const decode = (s) =>
  s.replace(/&#0?39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
const exists = (p) => fs.access(p).then(() => true, () => false);

async function designerPage(src) {
  const file = path.join(CACHE, `${src}.html`);
  if (await exists(file)) return fs.readFile(file, "utf8");
  let html;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://www.fragrantica.com/designers/${src}.html`, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`${src}: HTTP ${res.status}`);
      html = await res.text();
      break;
    } catch (err) {
      if (attempt >= 4) throw err;
      await sleep(3000 * attempt);
    }
  }
  await fs.writeFile(file, html);
  await sleep(1200); // be polite
  return html;
}

function inferType(name) {
  const n = name.toLowerCase();
  if (/hair mist|hair perfume/.test(n)) return "Hair Mist";
  if (/body mist|fragrance mist|\bmist\b|body spray/.test(n)) return "Body Mist";
  if (/extrait/.test(n)) return "Extrait";
  if (/elixir/.test(n)) return "Elixir";
  if (/eau de parfum|\bedp\b/.test(n)) return "EDP";
  if (/eau de toilette|\bedt\b/.test(n)) return "EDT";
  if (/cologne/.test(n)) return "Cologne";
  if (/\bparfum\b|\bperfume\b/.test(n)) return "Parfum";
  return null;
}

const GENDER = { male: "Men", female: "Women", unisex: "Unisex" };

function parse(html, brand) {
  const designer = decode((html.match(/<title>([^<]+?) Perfumes And Colognes/) || [])[1] || brand.name);
  // Names on Fragrantica start with the house name; strip it (apostrophes vary)
  const norm = (x) => x.replace(/[’`]/g, "'").toLowerCase();
  const prefixes = [...new Set([designer, brand.name])].map((x) => norm(x) + " ");
  const items = [];
  const seen = new Set();
  // Section headers ("Sauvage Collection") precede their items in the list view.
  const re = /tw-gridlist-section-title">([^<]+)<|<a\s+href="(\/perfume\/[^"]+-(\d+)\.html)"[^>]*?title="([^"]+)"\s+class="group prefumeHbox tw-listview-item tw-listview-item-(male|female|unisex)([^"]*)"([\s\S]*?)<\/a>/g;
  let collection = null;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) { collection = decode(m[1]).trim(); continue; }
    const [, , , fid, rawTitle, g, extra, body] = m;
    if (seen.has(fid)) continue;
    seen.add(fid);
    if (/saturate-50|opacity-75/.test(extra)) continue; // discontinued
    let title = decode(rawTitle).replace(/\s+/g, " ").trim();
    const year = (title.match(/ (\d{4})$/) || [])[1];
    title = title.replace(/ \d{4}$/, "").replace(/ (male|female|unisex)$/, "").trim();
    let name = title;
    for (const pre of prefixes) if (norm(name).startsWith(pre)) { name = name.slice(pre.length); break; }
    name = name.trim();
    if (brand.only && !brand.only.test(name)) continue;
    const counts = [...body.matchAll(/<span>(\d+)<\/span>/g)];
    const reviews = counts.length ? Number(counts[counts.length - 1][1]) : 0;
    items.push({
      fid: Number(fid),
      name,
      gender: GENDER[g],
      year: year ? Number(year) : null,
      collection: collection && !/^(other|perfumes?|all fragrances|all perfumes)$/i.test(collection) ? collection : null,
      reviews,

    });
  }
  return items;
}

async function download(fid) {
  const file = path.join(IMG_DIR, `${fid}.jpg`);
  if (await exists(file)) return "cached";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://fimgs.net/mdimg/perfume/375x500.${fid}.jpg`, { headers: { "User-Agent": UA } });
      if (res.status === 404) return "missing";
      if (!res.ok) throw new Error(res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1500) return "missing";
      await fs.writeFile(file, buf);
      return "ok";
    } catch {
      await sleep(800 * (attempt + 1));
    }
  }
  return "failed";
}

/* ---------- main ---------- */
const withImages = !process.argv.includes("--no-images");
await fs.mkdir(CACHE, { recursive: true });
await fs.mkdir(IMG_DIR, { recursive: true });
await fs.mkdir(path.dirname(OUT), { recursive: true });

const brands = [];
const products = [];
for (const b of BRANDS) {
  const html = await designerPage(b.src);
  let items = parse(html, b).sort((x, y) => y.reviews - x.reviews);
  const curatedHere = items.filter((i) => CURATED[i.fid]);
  items = items.slice(0, MAX_PER_BRAND);
  for (const c of curatedHere) if (!items.includes(c)) items.push(c);

  const slug = slugify(b.name);
  for (const i of items) {
    const cur = CURATED[i.fid] || {};
    products.push({
      id: `${slug}-${slugify(i.name)}-${i.fid}`,
      fid: i.fid,
      brand: b.name,
      brandSlug: slug,
      name: i.name,
      gender: i.gender,
      year: i.year,
      collection: i.collection,
      reviews: i.reviews,
      type: cur.type || inferType(i.name) || b.defaultType || null,
      ...(cur.family && { family: cur.family }),
      ...(cur.sizes && { sizes: cur.sizes }),
      ...(cur.notes && { notes: cur.notes }),
      ...(cur.tags && { tags: cur.tags }),
    });
  }
  brands.push({ name: b.name, slug, origin: b.origin, category: b.cat, aka: b.aka || "", count: items.length });
  console.log(`${b.name.padEnd(26)} ${String(items.length).padStart(4)} listed`);
}

/* ---------- body care: mists, lotions, washes ---------- */
const scentKey = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ")
    .replace(/(fine )?(fragrance|body) mist|mist|\(\d{4}\)/g, " ").replace(/[^a-z0-9]+/g, "");
let unmatched = [];
for (const e of BODY_CARE) {
  const slug = slugify(e.brand);
  const gender = e.gender || "Women";
  const bottleFor = (shape) => ({ shape, liquid: e.color, cap: e.cap });
  let rank = 0; // lotions/washes sort alongside their scent's mist
  for (const line of e.lines) {
    if (line === "Body Mist") {
      const match = products
        .filter((p) => p.brandSlug === slug && scentKey(p.name) === scentKey(e.scent))
        .sort((a, b) => (b.type === "Body Mist") - (a.type === "Body Mist") || b.reviews - a.reviews)[0];
      if (match) {
        Object.assign(match, { type: "Body Mist", bodycare: true });
        if (!match.family) match.family = e.family;
        rank = match.reviews;
        continue;
      }
      unmatched.push(`${e.brand} ${e.scent}`);
    }
    products.push({
      id: `${slug}-${slugify(e.scent)}-${slugify(line)}`,
      fid: null,
      brand: e.brand,
      brandSlug: slug,
      name: e.scent,
      gender,
      year: null,
      collection: "Body Care",
      reviews: rank,
      type: line,
      family: e.family,
      bodycare: true,
      bottle: bottleFor(line === "Body Wash" ? "wash" : line === "Body Lotion" ? "lotion" : "mist"),
      noImage: true,
    });
  }
}
if (unmatched.length) console.log("Body mists shown as illustrations (no listing matched):", unmatched.join(", "));
for (const b of brands) b.count = products.filter((p) => p.brandSlug === b.slug).length;

if (withImages) {
  const queue = products.filter((p) => p.fid);
  const stats = {};
  let done = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const p = queue.shift();
        const r = await download(p.fid);
        stats[r] = (stats[r] || 0) + 1;
        if (r === "missing" || r === "failed") p.noImage = true;
        if (++done % 250 === 0) console.log(`  images ${done}/${products.length}`);
      }
    })
  );
  console.log("images:", stats);
} else {
  for (const p of products) if (p.fid && !(await exists(path.join(IMG_DIR, `${p.fid}.jpg`)))) p.noImage = true;
}

// Compact JSON: one product per line
const json = `{"brands":[\n${brands.map((b) => JSON.stringify(b)).join(",\n")}\n],"products":[\n${products.map((p) => JSON.stringify(p)).join(",\n")}\n]}\n`;
await fs.writeFile(OUT, json);
console.log(`\n${brands.length} brands, ${products.length} fragrances -> public/data/catalogue.json`);
