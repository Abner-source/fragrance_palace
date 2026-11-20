/* ==========================================================
   MIND FREAK — Fragrance Palace's own in-house brand.
   It is listed as a regular house alongside the others: these
   entries are merged into the catalogue when it loads, so it gets
   a brand tile, a brand page, product pages and search like any
   other brand. Add or edit products here.
   Images live in public/images/mind-freak/ (square, white background).
   ========================================================== */
const IMG = `${import.meta.env.BASE_URL}images/mind-freak/`;

export const MF_BRAND = {
  name: "Mind Freak",
  slug: "mind-freak",
  origin: "Dubai",
  category: "arabian",
  aka: "Mindfreak Fragrance Palace own brand in-house",
};

const ITEMS = [
  { key: "parfum", name: "Mind Freak", type: "Parfum", gender: "Men", img: "parfum.jpg" },
  { key: "pour-femme", name: "Mind Freak Pour Femme", type: "Parfum", gender: "Women", img: "pour-femme.jpg" },
  { key: "icon-elixir-homme", name: "Icon Elixir Homme", type: "Eau de Parfum", gender: "Men", img: "icon-elixir-homme.jpg" },
  { key: "marshmallow", name: "Marshmallow", type: "Eau de Parfum", gender: "Women", img: "marshmallow.jpg" },
];

export const MF_PRODUCTS = ITEMS.map((i) => ({
  id: `mind-freak-${i.key}`,
  fid: null,
  brand: MF_BRAND.name,
  brandSlug: MF_BRAND.slug,
  name: i.name,
  gender: i.gender,
  year: null,
  collection: null,
  reviews: 0,
  type: i.type,
  sizes: [[100]],
  tags: ["Exclusive"],
  img: `${IMG}${i.img}`,
}));
