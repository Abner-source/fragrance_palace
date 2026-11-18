import { useMemo, useState } from "react";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { CATEGORY_LONG, fold } from "../lib/catalogue.js";
import BrandTile from "../components/BrandTile.jsx";
import { PageLoader, TitleBlock, useTitle } from "../components/Sections.jsx";

const TABS = [["", "All houses"], ["designer", "Designer"], ["niche", "Niche"], ["arabian", "Arabian"]];

export default function Brands() {
  useTitle("All brands");
  const { data, error } = useCatalogue();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    if (!data) return [];
    const list = data.brands
      .filter((b) => !cat || b.category === cat)
      .filter((b) => !q || fold(b.name + " " + b.aka).includes(fold(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
    const by = {};
    for (const b of list) {
      const letter = /[a-z]/i.test(fold(b.name)[0]) ? fold(b.name)[0].toUpperCase() : "#";
      (by[letter] ||= []).push(b);
    }
    return Object.entries(by).sort(([a], [b]) => a.localeCompare(b));
  }, [data, cat, q]);

  return (
    <section className="section">
      <div className="wrap">
        <TitleBlock title="HOUSES" sub={data ? `${data.brands.length} fragrance houses · ${data.products.length.toLocaleString()} fragrances` : null} />
        {!data ? <PageLoader error={error} /> : (
          <>
            <div className="brands-bar">
              <div className="tabs" role="tablist" aria-label="Brand category">
                {TABS.map(([v, l]) => (
                  <button key={l} role="tab" aria-selected={cat === v} className={`tab${cat === v ? " is-active" : ""}`} onClick={() => setCat(v)}>{l}</button>
                ))}
              </div>
              <input className="brands-bar__find" type="search" placeholder="Find a house" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a house" />
            </div>

            <nav className="az" aria-label="Jump to letter">
              {groups.map(([l]) => <a key={l} href={`#letter-${l}`}>{l}</a>)}
            </nav>

            {cat && <p className="brands-cat">{CATEGORY_LONG[cat]}</p>}
            {groups.length === 0 && <p className="empty">No houses match “{q}”.</p>}
            {groups.length > 0 && (
              <div className="brand-tiles brand-tiles--index">
                {groups.flatMap(([letter, list]) =>
                  list.map((b, i) => (
                    <BrandTile key={b.slug} brand={b} id={i === 0 ? `letter-${letter}` : undefined} letter={i === 0 ? letter : null} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
