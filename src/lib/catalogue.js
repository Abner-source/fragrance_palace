import CONFIG from "../data/config.js";

const BASE = import.meta.env.BASE_URL;

export const imageUrl = (p) => `${BASE}images/products/${p.fid}.jpg`;
export const money = (n) => `${CONFIG.currency} ${n.toLocaleString("en-US")}`;
export const fromPrice = (p) => (p.sizes ? Math.min(...p.sizes.map((s) => s[1])) : null);
export const fold = (s) =>
  String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const GENDER_LABEL = { Men: "For him", Women: "For her", Unisex: "Unisex" };
export const CATEGORY_LABEL = { designer: "Designer", niche: "Niche", arabian: "Arabian" };
export const CATEGORY_LONG = {
  designer: "Designer houses",
  niche: "Niche & luxury houses",
  arabian: "Arabian perfumery",
};

export const SORTS = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A–Z" },
  { value: "brand", label: "Brand A–Z" },
];

/** Builds the lookup structures once after the catalogue JSON loads. */
export function indexCatalogue({ brands, products }) {
  const brandBySlug = Object.fromEntries(brands.map((b) => [b.slug, b]));
  for (const p of products) {
    const b = brandBySlug[p.brandSlug];
    p.category = b.category;
    p.image = p.noImage ? null : imageUrl(p);
    p._search = fold(
      [p.brand, b.aka, p.name, p.collection, p.type, p.year, p.gender,
        ...(p.notes ? [...p.notes.top, ...p.notes.heart, ...p.notes.base] : [])].join(" ")
    );
  }
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const byBrand = {};
  for (const p of products) (byBrand[p.brandSlug] ||= []).push(p);
  // Each brand's most-reviewed fragrance with a photo represents it on brand tiles
  for (const b of brands) {
    const list = byBrand[b.slug] || [];
    b.hero = list.find((p) => p.image) || list[0] || null;
  }
  return { brands, products, byId, byBrand, brandBySlug };
}

export function searchProducts(list, q) {
  const words = fold(q).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter((p) => words.every((w) => p._search.includes(w)));
}

export function sortProducts(list, sort) {
  const l = [...list];
  switch (sort) {
    case "newest": return l.sort((a, b) => (b.year || 0) - (a.year || 0) || b.reviews - a.reviews);
    case "name": return l.sort((a, b) => a.name.localeCompare(b.name));
    case "brand": return l.sort((a, b) => a.brand.localeCompare(b.brand) || b.reviews - a.reviews);
    default: return l.sort((a, b) => b.reviews - a.reviews);
  }
}
