import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { CATEGORY_LONG, SORTS, fold, searchProducts, sortProducts } from "../lib/catalogue.js";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import ProductCard from "./ProductCard.jsx";

const PAGE = 24;
const GENDERS = [["", "All"], ["Men", "For Him"], ["Women", "For Her"], ["Unisex", "Unisex"]];

/*
  Filterable, sortable product grid. Filter state lives in the URL
  (?q=&gender=&cat=&brand=&col=&type=&sort=) so every view is linkable.
  mode "catalogue": category + brand facets. mode "brand": collection facet.
*/
export default function ProductBrowser({ base, mode = "catalogue" }) {
  const { data } = useCatalogue();
  const { enquire } = useEnquiry();
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);
  const [panelOpen, setPanelOpen] = useState(false);

  const list = (k) => (params.get(k) ? params.get(k).split(",") : []);
  const f = {
    q: params.get("q") || "",
    gender: params.get("gender") || "",
    sort: params.get("sort") || (mode === "catalogue" ? "popular" : "popular"),
    cat: list("cat"),
    brand: list("brand"),
    col: list("col"),
    type: list("type"),
  };

  const update = (patch) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      const val = Array.isArray(v) ? v.join(",") : v;
      if (val) next.set(k, val);
      else next.delete(k);
    }
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const toggle = (k, v) => update({ [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  // Base list narrowed by search + gender: facet counts are taken from here
  const pre = useMemo(() => {
    let l = searchProducts(base, f.q);
    if (f.gender) l = l.filter((p) => p.gender === f.gender);
    return l;
  }, [base, f.q, f.gender]);

  const results = useMemo(() => {
    let l = pre;
    if (f.cat.length) l = l.filter((p) => f.cat.includes(p.category));
    if (f.brand.length) l = l.filter((p) => f.brand.includes(p.brandSlug));
    if (f.col.length) l = l.filter((p) => f.col.includes(p.collection || "Other"));
    if (f.type.length) l = l.filter((p) => f.type.includes(p.type || "Other"));
    return sortProducts(l, f.sort);
  }, [pre, f.cat.join(), f.brand.join(), f.col.join(), f.type.join(), f.sort]);

  const key = params.toString();
  useEffect(() => setShown(PAGE), [key]);
  useEffect(() => {
    document.body.classList.toggle("is-locked", panelOpen);
    return () => document.body.classList.remove("is-locked");
  }, [panelOpen]);

  const count = (getter) => {
    const m = new Map();
    for (const p of pre) { const v = getter(p); m.set(v, (m.get(v) || 0) + 1); }
    return m;
  };

  const facets = [];
  if (mode === "catalogue") {
    const c = count((p) => p.category);
    facets.push({ key: "cat", title: "Category", open: true, options: ["designer", "niche", "arabian"].filter((v) => c.get(v)).map((v) => ({ value: v, label: CATEGORY_LONG[v], n: c.get(v) })) });
    const b = count((p) => p.brandSlug);
    facets.push({ key: "brand", title: "Brand", open: true, searchable: true, options: data.brands.filter((x) => b.get(x.slug)).sort((x, y) => x.name.localeCompare(y.name)).map((x) => ({ value: x.slug, label: x.name, n: b.get(x.slug) })) });
  } else if (mode === "body") {
    const b = count((p) => p.brandSlug);
    facets.push({ key: "brand", title: "Brand", open: true, options: data.brands.filter((x) => b.get(x.slug)).map((x) => ({ value: x.slug, label: x.name, n: b.get(x.slug) })) });
  } else {
    const c = count((p) => p.collection || "Other");
    const opts = [...c.entries()].sort((a, b) => (a[0] === "Other") - (b[0] === "Other") || b[1] - a[1]);
    if (opts.length > 1) facets.push({ key: "col", title: "Collection", open: true, searchable: opts.length > 12, options: opts.map(([v, n]) => ({ value: v, label: v, n })) });
  }
  const t = count((p) => p.type || "Other");
  const typeOrder = ["EDP", "EDT", "Parfum", "Extrait", "Elixir", "Cologne", "Body Mist", "Body Lotion", "Body Wash", "Hair Mist", "Other"];
  facets.push({ key: "type", title: mode === "body" ? "Product" : "Concentration", open: mode === "body", options: typeOrder.filter((v) => t.get(v)).map((v) => ({ value: v, label: v === "Other" ? "Not specified" : v, n: t.get(v) })) });

  const labelFor = (k, v) => {
    if (k === "cat") return CATEGORY_LONG[v];
    if (k === "brand") return data.brandBySlug[v]?.name || v;
    if (k === "type" && v === "Other") return "Not specified";
    return v;
  };
  const chips = [
    ...(f.q ? [{ k: "q", v: f.q, label: `“${f.q}”` }] : []),
    ...(f.gender ? [{ k: "gender", v: f.gender, label: f.gender }] : []),
    ...["cat", "brand", "col", "type"].flatMap((k) => f[k].map((v) => ({ k, v, label: labelFor(k, v) }))),
  ];
  const removeChip = (c) => (["q", "gender"].includes(c.k) ? update({ [c.k]: "" }) : toggle(c.k, c.v));
  const visible = results.slice(0, shown);

  return (
    <div className="browser">
      <div className="cat-bar">
        <div className="tabs" role="tablist" aria-label="Filter by gender">
          {GENDERS.map(([value, label]) => (
            <button key={label} role="tab" aria-selected={f.gender === value} className={`tab${f.gender === value ? " is-active" : ""}`} onClick={() => update({ gender: value })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="catalogue">
        <aside className={`filters${panelOpen ? " is-open" : ""}`} aria-label="Filters">
          <div className="filters__head">
            <span>FILTER</span>
            <button className="filters__close" onClick={() => setPanelOpen(false)} aria-label="Close filters">✕</button>
          </div>
          <label className="filters__search">
            <span className="sr-only">Search</span>
            <input type="search" placeholder={mode === "brand" ? "Search this house" : "Search brand, name or note"} autoComplete="off" value={f.q} onChange={(e) => update({ q: e.target.value })} />
          </label>
          {facets.map((facet) => (
            <Facet key={facet.key} facet={facet} selected={f[facet.key]} onToggle={(v) => toggle(facet.key, v)} />
          ))}
          <button className="btn btn--outline btn--block" onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}>Clear all filters</button>
          <button className="btn btn--dark btn--block filters__done" onClick={() => setPanelOpen(false)}>Show {results.length} results</button>
        </aside>
        {panelOpen && <div className="filters-backdrop" onClick={() => setPanelOpen(false)} />}

        <div className="results">
          <div className="results__bar">
            <button className="btn btn--outline btn--sm filters-open" onClick={() => setPanelOpen(true)}>
              Filters {chips.length ? `(${chips.length})` : ""}
            </button>
            <p className="results__count" aria-live="polite">
              {results.length.toLocaleString()} {mode === "body" ? "product" : "fragrance"}{results.length === 1 ? "" : "s"}
            </p>
            <label className="sort">
              <span>Sort</span>
              <select value={f.sort} onChange={(e) => update({ sort: e.target.value === "popular" ? "" : e.target.value })}>
                {SORTS.filter((s) => mode !== "brand" || s.value !== "brand").map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="chips">
              {chips.map((c) => (
                <button key={c.k + c.v} className="chip" onClick={() => removeChip(c)} aria-label={`Remove ${c.label}`}>
                  {c.label} <span aria-hidden="true">✕</span>
                </button>
              ))}
            </div>
          )}

          {results.length ? (
            <div className="grid">
              {visible.map((p) => <ProductCard key={p.id} product={p} showBrand={mode !== "brand"} />)}
            </div>
          ) : (
            <div className="empty">
              <p>No fragrances match those filters.</p>
              <p>We can probably source it. <button className="link-btn" onClick={() => enquire()}>Ask us on WhatsApp</button></p>
            </div>
          )}

          {visible.length < results.length && (
            <div className="load-more">
              <p className="load-more__count">Showing {visible.length} of {results.length.toLocaleString()}</p>
              <button className="btn btn--dark" onClick={() => setShown((n) => n + PAGE)}>Load more</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Facet({ facet, selected, onToggle }) {
  const [q, setQ] = useState("");
  const opts = facet.searchable && q ? facet.options.filter((o) => fold(o.label).includes(fold(q))) : facet.options;
  if (!facet.options.length) return null;
  return (
    <details className="facet" open={facet.open}>
      <summary>{facet.title}</summary>
      {facet.searchable && (
        <input className="facet__find" type="search" placeholder={`Find ${facet.title.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} />
      )}
      <div className="facet__body">
        {opts.map((o) => (
          <label className="check" key={o.value}>
            <input type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
            {o.label}
            <em>{o.n}</em>
          </label>
        ))}
      </div>
    </details>
  );
}
