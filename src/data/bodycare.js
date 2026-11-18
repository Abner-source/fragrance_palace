/* Body care: body mists, body lotions and body washes.
   ----------------------------------------------------------
   Each scent below becomes one product per item in `lines`.
   - "Body Mist" reuses that scent's Fragrantica listing (and its photo) when one
     matches by name; otherwise an illustrated mist bottle is shown.
   - "Body Lotion" and "Body Wash" get an illustrated bottle in the scent's colour.
   Rerun `npm run catalogue -- --no-images` after editing.
   color: bottle colour · cap: cap colour · family: Fresh | Floral | Amber | Gourmand | Woody */

const VS = "Victoria's Secret";
const BBW = "Bath & Body Works";

export const BODY_CARE = [
  // Victoria's Secret — body mists and fragrance lotions
  { brand: VS, scent: "Bare Vanilla", family: "Gourmand", color: "#ead7bd", cap: "#c9a77c", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Pure Seduction", family: "Floral", color: "#c23a5c", cap: "#7b1630", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Love Spell", family: "Floral", color: "#e9a2b8", cap: "#a8325f", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Velvet Petals", family: "Floral", color: "#f1c3cc", cap: "#b8576e", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Coconut Passion", family: "Gourmand", color: "#f5e3c8", cap: "#b77c4a", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Amber Romance", family: "Amber", color: "#e7b985", cap: "#8b4f22", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Aqua Kiss", family: "Fresh", color: "#bfe3e8", cap: "#3d8ea0", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Midnight Bloom", family: "Floral", color: "#4a3d74", cap: "#221a3f", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Romantic", family: "Floral", color: "#f3c9d6", cap: "#c4638a", lines: ["Body Mist", "Body Lotion"] },
  { brand: VS, scent: "Strawberries and Champagne", family: "Gourmand", color: "#f2b3b0", cap: "#c8504d", lines: ["Body Mist", "Body Lotion"] },

  // Bath & Body Works — body mists, body lotions and body washes
  { brand: BBW, scent: "A Thousand Wishes", family: "Floral", color: "#f2d0d6", cap: "#c49a4a", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Japanese Cherry Blossom", family: "Floral", color: "#f6cdd9", cap: "#d4708f", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Gingham", family: "Fresh", color: "#c9dcf2", cap: "#3e6aa8", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Champagne Toast", family: "Fresh", color: "#f4e1b8", cap: "#c49a4a", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Warm Vanilla Sugar", family: "Gourmand", color: "#f1e2c8", cap: "#a87b45", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Into the Night", family: "Amber", color: "#3a3550", cap: "#141220", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Sweet Pea", family: "Floral", color: "#f7c6d2", cap: "#9a6fb0", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Moonlight Path", family: "Floral", color: "#c7c3e3", cap: "#5b4f93", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Pink Pineapple Sunrise", family: "Fresh", color: "#f8c9a8", cap: "#e0717a", lines: ["Body Mist", "Body Lotion", "Body Wash"] },
  { brand: BBW, scent: "Mahogany Teakwood", gender: "Men", family: "Woody", color: "#6b3b2a", cap: "#1d1d1d", lines: ["Body Wash", "Body Lotion"] },
  { brand: BBW, scent: "Ocean", gender: "Men", family: "Fresh", color: "#2f5f86", cap: "#1d1d1d", lines: ["Body Wash", "Body Lotion"] },
];

export const BODY_TYPES = ["Body Mist", "Body Lotion", "Body Wash"];
