import { useMemo } from "react";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import ProductBrowser from "../components/ProductBrowser.jsx";
import { PageLoader, TitleBlock, useTitle } from "../components/Sections.jsx";

export default function BodyCare() {
  useTitle("Body mists, lotions & washes");
  const { data, error } = useCatalogue();
  const products = useMemo(() => (data ? data.products.filter((p) => p.bodycare) : []), [data]);

  return (
    <section className="section">
      <div className="wrap">
        <TitleBlock
          title="BODY CARE"
          sub="Body mists and lotions from Victoria's Secret, plus mists, lotions and body washes from Bath & Body Works."
        />
        {data ? <ProductBrowser base={products} mode="body" /> : <PageLoader error={error} />}
      </div>
    </section>
  );
}
