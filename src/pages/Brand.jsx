import { useParams } from "react-router";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { CATEGORY_LONG } from "../lib/catalogue.js";
import ProductBrowser from "../components/ProductBrowser.jsx";
import ProductMedia from "../components/ProductMedia.jsx";
import { Breadcrumbs, PageLoader, useTitle } from "../components/Sections.jsx";
import NotFound from "./NotFound.jsx";

export default function Brand() {
  const { slug } = useParams();
  const { data, error } = useCatalogue();
  const brand = data?.brandBySlug[slug];
  useTitle(brand ? `${brand.name} perfumes` : "Brand");

  if (!data) return <PageLoader error={error} />;
  if (!brand) return <NotFound />;
  const products = data.byBrand[slug] || [];
  const showcase = products.filter((p) => p.image).slice(0, 3);

  return (
    <>
      <section className="brand-hero">
        <div className="wrap brand-hero__inner">
          <div className="brand-hero__text">
            <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Brands", to: "/brands" }, { label: brand.name }]} />
            <p className="eyebrow eyebrow--light">{[brand.origin, CATEGORY_LONG[brand.category]].filter(Boolean).join(" · ")}</p>
            <h1 className="brand-hero__name">{brand.name}</h1>
            <p className="brand-hero__count">{products.length} fragrance{products.length === 1 ? "" : "s"} in the catalogue</p>
          </div>
          <div className="brand-hero__bottles" aria-hidden="true">
            {showcase.map((p) => <span key={p.id}><ProductMedia product={p} eager /></span>)}
          </div>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap">
          <ProductBrowser base={products} mode="brand" key={slug} />
        </div>
      </section>
    </>
  );
}
