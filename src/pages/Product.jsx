import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import { CATEGORY_LABEL, GENDER_LABEL } from "../lib/catalogue.js";
import ProductMedia from "../components/ProductMedia.jsx";
import { ProductRow } from "../components/ProductCard.jsx";
import { WhatsAppIcon } from "../components/Icons.jsx";
import { Breadcrumbs, PageLoader, RuleTitle, useTitle } from "../components/Sections.jsx";
import NotFound from "./NotFound.jsx";

export default function Product() {
  const { id } = useParams();
  const { data, error } = useCatalogue();
  const { enquire } = useEnquiry();
  const p = data?.byId[id];
  useTitle(p ? `${p.brand} ${p.name}` : "Fragrance");

  const defaultSize = p?.sizes ? p.sizes[p.sizes.length > 1 ? 1 : 0][0] : null;
  const [ml, setMl] = useState(defaultSize);
  useEffect(() => setMl(defaultSize), [id, defaultSize]);

  if (!data) return <PageLoader error={error} />;
  if (!p) return <NotFound />;

  const siblings = data.byBrand[p.brandSlug].filter((x) => x.id !== p.id);
  const sameLine = p.collection ? siblings.filter((x) => x.collection === p.collection).slice(0, 4) : [];
  const moreBrand = siblings.filter((x) => !sameLine.includes(x)).slice(0, 4);

  const facts = [
    ["House", <Link to={`/brands/${p.brandSlug}`}>{p.brand}</Link>],
    [p.bodycare ? "Product" : "Concentration", p.type],
    ["For", GENDER_LABEL[p.gender]],
    ["Launched", p.year],
    ["Collection", p.collection],
    ["Scent family", p.family],
    ["Category", CATEGORY_LABEL[p.category]],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <Breadcrumbs items={[
            { label: "Home", to: "/" },
            { label: "Brands", to: "/brands" },
            { label: p.brand, to: `/brands/${p.brandSlug}` },
            { label: p.name },
          ]} />

          <div className="pd pd--page">
            <div className="pd__media">
              {(p.tags || [])[0] && <span className={`card__tag card__tag--${p.tags[0]}`}>{p.tags[0]}</span>}
              <ProductMedia product={p} eager key={p.id} />
            </div>

            <div className="pd__info">
              <Link className="pd__brand" to={`/brands/${p.brandSlug}`}>{p.brand}</Link>
              <h1 className="pd__name">{p.name}</h1>
              <div className="pd__meta">
                {p.type && <span className="pd__pill">{p.type}</span>}
                <span className="pd__pill">{GENDER_LABEL[p.gender]}</span>
                {p.family && <span className="pd__pill">{p.family}</span>}
                {(p.tags || []).map((t) => <span className="pd__pill" key={t}>{t}</span>)}
              </div>

              {p.sizes ? (
                <>
                  <p className="pd__label">Size</p>
                  <div className="sizes" role="radiogroup" aria-label="Size">
                    {p.sizes.map(([size]) => (
                      <button key={size} role="radio" aria-checked={ml === size} className={`size${ml === size ? " is-active" : ""}`} onClick={() => setMl(size)}>
                        <b>{size} ml</b>
                      </button>
                    ))}
                  </div>
                  <p className="pd__fine">Availability and delivery are confirmed on WhatsApp.</p>
                </>
              ) : (
                <div className="pd__por">
                  <strong>Available on enquiry</strong>
                  <span>Message us on WhatsApp for sizes and availability.</span>
                </div>
              )}

              {p.notes && (
                <>
                  <p className="pd__label">Fragrance notes</p>
                  <dl className="pyramid">
                    <div><dt>Top</dt><dd>{p.notes.top.join(", ")}</dd></div>
                    <div><dt>Heart</dt><dd>{p.notes.heart.join(", ")}</dd></div>
                    <div><dt>Base</dt><dd>{p.notes.base.join(", ")}</dd></div>
                  </dl>
                </>
              )}

              <div className="pd__actions">
                <button className="btn btn--wa btn--block" onClick={() => enquire(p, ml)}>
                  <WhatsAppIcon />Enquire on WhatsApp
                </button>
                <Link className="btn btn--outline btn--block" to={`/brands/${p.brandSlug}`}>
                  More from {p.brand}
                </Link>
              </div>

              <dl className="facts">
                {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {sameLine.length > 0 && (
        <section className="section section--tint section--tight">
          <div className="wrap">
            <RuleTitle small link={{ to: `/brands/${p.brandSlug}?col=${encodeURIComponent(p.collection)}`, label: "View collection" }}>
              {p.collection.toUpperCase()}
            </RuleTitle>
            <ProductRow products={sameLine} showBrand={false} />
          </div>
        </section>
      )}
      {moreBrand.length > 0 && (
        <section className="section section--tight">
          <div className="wrap">
            <RuleTitle small link={{ to: `/brands/${p.brandSlug}`, label: `All ${p.brand}` }}>MORE FROM {p.brand.toUpperCase()}</RuleTitle>
            <ProductRow products={moreBrand} showBrand={false} />
          </div>
        </section>
      )}
    </>
  );
}
