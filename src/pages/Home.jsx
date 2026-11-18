import { useMemo } from "react";
import { Link } from "react-router";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import ProductMedia from "../components/ProductMedia.jsx";
import { ProductRow } from "../components/ProductCard.jsx";
import BrandTile from "../components/BrandTile.jsx";
import { MF_IMG, MIND_FREAK } from "../data/mindfreak.js";
import { HowToOrder, PageLoader, RuleTitle, STOREFRONT, TitleBlock, VisitBlock, useTitle } from "../components/Sections.jsx";

const EDIT_TILES = [
  { n: "1", title: "FRESH", families: ["Fresh"] },
  { n: "2", title: "FLORAL", families: ["Floral"] },
  { n: "3", title: "AMBER", families: ["Amber", "Gourmand"] },
  { n: "4", title: "OUD & WOODS", families: ["Oud", "Woody"] },
];

// Houses featured on the home page, in this order
const FEATURED = ["dior", "chanel", "tom-ford", "creed", "parfums-de-marly", "xerjoff", "amouage", "maison-francis-kurkdjian", "lattafa", "afnan", "ibraheem-al-qurashi", "khadlaj", "giorgio-armani", "versace"];

// Fragrance Palace's own in-house brand: a teaser that leads to /mind-freak
function MindFreak({ onEnquire }) {
  return (
    <section className="mf" id="mind-freak" aria-labelledby="mf-title">
      <div className="wrap mf__inner">
        <div className="mf__copy">
          <p className="eyebrow mf__eyebrow">Our own brand · Made for Fragrance Palace</p>
          <h2 className="mf__title" id="mf-title"><span>Mind</span> Freak</h2>
          <p className="mf__line">The in-house collection · {MIND_FREAK.length} fragrances</p>
          <p className="mf__text">
            Mind Freak is our own fragrance house, created by the team behind Fragrance
            Palace. After years of helping customers find their signature among the world's
            great perfumes, we made our own.
          </p>
          <p className="mf__text">
            Each fragrance is made to last and to be noticed, and you won't find them
            anywhere else. They're only available from us.
          </p>
          <div className="hero__ctas">
            <Link className="btn mf__btn" to="/mind-freak">Explore Mind Freak <span aria-hidden="true">›</span></Link>
            <button className="btn btn--ghost" onClick={onEnquire}>Ask on WhatsApp</button>
          </div>
        </div>
        <ul className="mf__media">
          {MIND_FREAK.map((p) => (
            <li className="mf__item" key={p.id}>
              <Link to={`/mind-freak#${p.id}`} className="mf__link">
                <span className="mf__card">
                  <img src={`${MF_IMG}${p.img}`} alt="" loading="lazy" />
                </span>
                <span className="mf__name">{p.name}</span>
                <span className="mf__sub">{p.type} · {p.ml} ml</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  useTitle("");
  const { data, error } = useCatalogue();
  const { enquire } = useEnquiry();

  const shelves = useMemo(() => {
    if (!data) return null;
    // One product per requested type, most popular first, no scent repeated
    const bodyShelf = (slug, types) => {
      const pool = data.products.filter((p) => p.bodycare && p.brandSlug === slug).sort((a, b) => b.reviews - a.reviews);
      const used = new Set();
      return types.map((t) => {
        const p = pool.find((x) => x.type === t && !used.has(x.name));
        if (p) used.add(p.name);
        return p;
      }).filter(Boolean);
    };
    const top = (filter, n) => data.products.filter((p) => p.image && filter(p)).sort((a, b) => b.reviews - a.reviews).slice(0, n);
    return {
      loved: top(() => true, 8),
      arabian: top((p) => p.category === "arabian", 4),
      niche: top((p) => p.category === "niche", 4),
      vs: bodyShelf("victoria-s-secret", ["Body Mist", "Body Lotion", "Body Mist", "Body Lotion"]),
      bbw: bodyShelf("bath-and-body-works", ["Body Mist", "Body Lotion", "Body Wash", "Body Mist"]),
      featured: FEATURED.map((s) => data.brandBySlug[s]).filter(Boolean),
    };
  }, [data]);

  return (
    <>
      <section className="hero">
        <img className="hero__img" src={STOREFRONT} alt="The Fragrance Palace storefront in Dubai, its windows stacked with perfume boxes" />
        <div className="hero__shade" />
        <div className="wrap hero__content">
          <p className="eyebrow eyebrow--light">Dubai · United Arab Emirates</p>
          <h1 className="hero__title">The world's fragrances,<br />under one roof.</h1>
          <p className="hero__lead">
            Designer icons, niche houses and Arabian favourites. Browse every house we carry, then
            message us on WhatsApp for availability and delivery.
          </p>
          <div className="hero__ctas">
            <Link to="/brands" className="btn btn--light">Shop by brand <span aria-hidden="true">›</span></Link>
            <Link to="/catalogue" className="btn btn--ghost">Full catalogue</Link>
          </div>
          <ul className="hero__facts">
            <li><strong>{data ? data.brands.length : "—"}</strong><span>Houses</span></li>
            <li><strong>{data ? data.products.length.toLocaleString() : "—"}</strong><span>Fragrances listed</span></li>
            <li><strong>100%</strong><span>Authentic</span></li>
          </ul>
        </div>
      </section>

      {!data ? <PageLoader error={error} /> : (
        <>
          <section className="section">
            <div className="wrap">
              <RuleTitle link={{ to: "/brands", label: `All ${data.brands.length} houses` }}>SHOP BY HOUSE</RuleTitle>
              <div className="brand-tiles">
                {shelves.featured.map((b) => <BrandTile key={b.slug} brand={b} />)}
              </div>
            </div>
          </section>

          <MindFreak onEnquire={() => enquire({ brand: "the Mind Freak", name: "collection" })} />

          <section className="section section--tint">
            <div className="wrap">
              <RuleTitle link={{ to: "/catalogue", label: "View catalogue" }}>MOST LOVED</RuleTitle>
              <ProductRow products={shelves.loved} />
            </div>
          </section>

          <section className="section">
            <div className="wrap">
              <TitleBlock title="SCENT EDIT" />
              <div className="intro">
                <div className="intro__left">
                  <h3>FIND YOUR FAMILY</h3>
                  <p className="intro__time">4 FAMILIES<br /><span>ONE SIGNATURE</span></p>
                </div>
                <div className="intro__right">
                  <p>Not sure where to start? Every fragrance belongs to a family. Here are our staff picks from each.</p>
                  <p>Fresh scents are clean and bright. Florals are romantic. Amber is warm and spiced. Oud and woods are deep and long-lasting.</p>
                </div>
              </div>
              <div className="edit-grid">
                {EDIT_TILES.map((t) => {
                  const picks = data.products.filter((p) => t.families.includes(p.family)).sort((a, b) => b.reviews - a.reviews).slice(0, 2);
                  return (
                    <article key={t.n} className="edit-tile">
                      <div className="edit-tile__head">
                        <h3 className="edit-tile__name">{t.title}</h3>
                      </div>
                      <div className="edit-tile__bottles">
                        {picks.map((p) => (
                          <Link className="edit-tile__item" key={p.id} to={`/product/${p.id}`} aria-label={`${p.brand} ${p.name}`}>
                            <ProductMedia product={p} />
                          </Link>
                        ))}
                      </div>
                      <div className="edit-tile__labels">
                        {picks.map((p) => {
                          const ml = p.sizes?.[p.sizes.length - 1]?.[0];
                          return (
                            <Link to={`/product/${p.id}`} key={p.id}>
                              <strong>{p.brand} · {p.name}</strong>
                              {ml && <span>{ml}ml</span>}
                            </Link>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="section section--tint">
            <div className="wrap split-shelves">
              <div>
                <RuleTitle small link={{ to: "/catalogue?cat=arabian", label: "View all" }}>ARABIAN FAVOURITES</RuleTitle>
                <ProductRow products={shelves.arabian} />
              </div>
              <div>
                <RuleTitle small link={{ to: "/catalogue?cat=niche", label: "View all" }}>NICHE ICONS</RuleTitle>
                <ProductRow products={shelves.niche} />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="wrap">
              <RuleTitle link={{ to: "/body-care", label: "Shop body care" }}>BODY MISTS &amp; LOTIONS</RuleTitle>
              <div className="split-shelves">
                <div>
                  <RuleTitle small link={{ to: "/body-care?brand=victoria-s-secret", label: "View all" }}>VICTORIA'S SECRET</RuleTitle>
                  <ProductRow products={shelves.vs} showBrand={false} />
                </div>
                <div>
                  <RuleTitle small link={{ to: "/body-care?brand=bath-and-body-works", label: "View all" }}>BATH &amp; BODY WORKS</RuleTitle>
                  <ProductRow products={shelves.bbw} showBrand={false} />
                </div>
              </div>
            </div>
          </section>

          <HowToOrder />
          <VisitBlock />
          <section className="section section--cta">
            <div className="wrap cta-band">
              <p>Looking for something you can't find here?</p>
              <button className="btn btn--light" onClick={() => enquire()}>Ask us on WhatsApp</button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
