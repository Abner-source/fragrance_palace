import { Link } from "react-router";
import { GENDER_LABEL } from "../lib/catalogue.js";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import ProductMedia from "./ProductMedia.jsx";
import { WhatsAppIcon } from "./Icons.jsx";

export default function ProductCard({ product: p, showBrand = true }) {
  const { enquire } = useEnquiry();
  const tag = (p.tags || [])[0];
  const meta = [p.type, GENDER_LABEL[p.gender], p.year].filter(Boolean).join(" · ");
  const url = `/product/${p.id}`;

  return (
    <article className="card">
      <Link className="card__media" to={url} aria-label={`View ${p.brand} ${p.name}`}>
        {tag && <span className={`card__tag card__tag--${tag}`}>{tag}</span>}
        <ProductMedia product={p} />
      </Link>
      <div className="card__body">
        {showBrand && <Link className="card__brand" to={`/brands/${p.brandSlug}`}>{p.brand}</Link>}
        <Link className="card__name" to={url}>{p.name}</Link>
        <span className="card__meta">{meta}</span>
        {p.notes && (
          <span className="card__notes">{[p.notes.top[0], p.notes.heart[0], p.notes.base[0]].filter(Boolean).join(", ")}</span>
        )}
        <div className="card__actions">
          <Link className="btn btn--outline" to={url}>Details</Link>
          <button className="btn btn--wa" onClick={() => enquire(p)}><WhatsAppIcon />Enquire</button>
        </div>
      </div>
    </article>
  );
}

/** Simple row of cards (home page shelves, related products). */
export function ProductRow({ products, showBrand = true }) {
  return (
    <div className="grid grid--row">
      {products.map((p) => <ProductCard key={p.id} product={p} showBrand={showBrand} />)}
    </div>
  );
}
