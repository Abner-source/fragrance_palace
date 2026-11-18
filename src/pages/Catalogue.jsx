import { useCatalogue } from "../lib/CatalogueContext.jsx";
import ProductBrowser from "../components/ProductBrowser.jsx";
import { PageLoader, TitleBlock, useTitle } from "../components/Sections.jsx";

export default function Catalogue() {
  useTitle("Catalogue");
  const { data, error } = useCatalogue();
  return (
    <section className="section">
      <div className="wrap">
        <TitleBlock title="CATALOGUE" sub={data ? `${data.products.length.toLocaleString()} fragrances from ${data.brands.length} houses` : null} />
        {data ? <ProductBrowser base={data.products} mode="catalogue" /> : <PageLoader error={error} />}
      </div>
    </section>
  );
}
