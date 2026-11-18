/* ==========================================================
   MIND FREAK — Fragrance Palace's own in-house brand.
   Add or edit products here; the home page section and the
   /mind-freak page both read from this list.
   Images live in public/images/mind-freak/ (square, white background).
   ========================================================== */
export const MF_IMG = `${import.meta.env.BASE_URL}images/mind-freak/`;

export const MIND_FREAK = [
  {
    id: "mind-freak-parfum",
    name: "Mind Freak",
    type: "Parfum",
    ml: 100,
    img: "parfum.jpg",
    blurb: "Deep sapphire glass, gold lettering and a textured black cap. A full parfum concentration.",
    alt: "Mind Freak Parfum, 100 ml, in a sapphire blue bottle with gold lettering and a textured black cap",
  },
  {
    id: "mind-freak-pour-femme",
    name: "Mind Freak Pour Femme",
    type: "Parfum",
    ml: 100,
    img: "pour-femme.jpg",
    blurb: "Frosted blush-pink glass with a black cap and gold collar. The feminine side of Mind Freak.",
    alt: "Mind Freak Pour Femme Parfum, 100 ml, in a frosted pink bottle with a black cap and gold collar",
  },
  {
    id: "icon-elixir-homme",
    name: "Icon Elixir Homme",
    type: "Eau de Parfum",
    ml: 100,
    img: "icon-elixir-homme.jpg",
    blurb: "Amber-gold glass under a jewelled gold cap, presented in a black and gold box.",
    alt: "Icon Elixir Homme Eau de Parfum, 100 ml, an amber-gold bottle with a gold cap beside its black and gold box",
  },
  {
    id: "marshmallow",
    name: "Marshmallow",
    type: "Eau de Parfum",
    ml: 100,
    img: "marshmallow.jpg",
    blurb: "Soft pink glass and a playful script label, boxed in pink with a blue geometric pattern.",
    alt: "Marshmallow Eau de Parfum, 100 ml, a pink bottle beside its pink box with a blue geometric pattern",
  },
];

/** Shape expected by enquire(): the WhatsApp message reads e.g. "Mind Freak Icon Elixir Homme Eau de Parfum (100ml)". */
export const mfEnquiry = (p) => ({
  brand: p.name.startsWith("Mind Freak") ? "" : "Mind Freak",
  name: p.name,
  type: p.type,
});
