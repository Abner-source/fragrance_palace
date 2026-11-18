import { Link } from "react-router";
import { CATEGORY_LABEL } from "../lib/catalogue.js";
import ProductMedia from "./ProductMedia.jsx";

export default function BrandTile({ brand: b, id, letter }) {
  return (
    <Link to={`/brands/${b.slug}`} className="brand-tile" id={id}>
      {letter && <span className="brand-tile__letter" aria-hidden="true">{letter}</span>}
      <span className="brand-tile__media">{b.hero && <ProductMedia product={b.hero} />}</span>
      <span className="brand-tile__name">{b.name}</span>
      <span className="brand-tile__meta">
        {[b.origin, CATEGORY_LABEL[b.category]].filter(Boolean).join(" · ")} · {b.count} fragrances
      </span>
    </Link>
  );
}
