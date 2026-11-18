import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import { MF_IMG, MIND_FREAK, mfEnquiry } from "../data/mindfreak.js";
import { WhatsAppIcon } from "../components/Icons.jsx";
import { Breadcrumbs, VisitBlock, useTitle } from "../components/Sections.jsx";

export default function MindFreak() {
  useTitle("Mind Freak, our own brand");
  const { enquire } = useEnquiry();
  const { hash } = useLocation();

  // Arriving from a home-page bottle (/mind-freak#marshmallow): scroll to that product.
  // Deferred so it runs after the layout's scroll-to-top on page change.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" }), 60);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <section className="mf mf--page" aria-labelledby="mf-page-title">
        <div className="wrap">
          <div className="mf__crumbs"><Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Mind Freak" }]} /></div>
          <div className="mf__hero">
            <p className="eyebrow mf__eyebrow">Our own brand · Made for Fragrance Palace</p>
            <h1 className="mf__title" id="mf-page-title"><span>Mind</span> Freak</h1>
            <p className="mf__line">The in-house collection · {MIND_FREAK.length} fragrances</p>
            <p className="mf__text">
              Mind Freak is our own fragrance house, created by the team behind Fragrance Palace.
              After years of helping customers find their signature among the world's great
              perfumes, we made our own.
            </p>
            <p className="mf__text">
              Each fragrance is made to last and to be noticed, and you won't find them anywhere
              else. Try them in the shop, or tap any bottle below to ask us about it on WhatsApp.
            </p>
          </div>

          <ul className="mf-grid">
            {MIND_FREAK.map((p) => (
              <li className="mf-card" key={p.id} id={p.id}>
                <div className="mf-card__media">
                  <img src={`${MF_IMG}${p.img}`} alt={p.alt} loading="lazy" />
                </div>
                <div className="mf-card__body">
                  <p className="mf-card__house">Mind Freak</p>
                  <h2 className="mf-card__name">{p.name}</h2>
                  <p className="mf-card__meta">{p.type} · {p.ml} ml</p>
                  <p className="mf-card__blurb">{p.blurb}</p>
                  <button className="btn mf__btn btn--block" onClick={() => enquire(mfEnquiry(p), p.ml)}>
                    <WhatsAppIcon />Enquire on WhatsApp
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="mf__foot">
            Prefer to smell them first? <Link to="/visit">Visit the shop</Link> and try every Mind Freak fragrance on a tester.
          </p>
        </div>
      </section>
      <VisitBlock />
    </>
  );
}
