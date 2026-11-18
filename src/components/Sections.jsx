import { useEffect } from "react";
import { Link } from "react-router";
import CONFIG from "../data/config.js";
import { useEnquiry } from "../lib/EnquiryContext.jsx";

export const STOREFRONT = `${import.meta.env.BASE_URL}images/storefront.jpg`;

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Fragrance Palace Dubai` : "Fragrance Palace Dubai | Designer, Niche & Arabian Perfumes";
  }, [title]);
}

export function TitleBlock({ kicker = "The", title, sub }) {
  return (
    <header className="title-block">
      <span className="title-block__kicker">{kicker}</span>
      <h1 className="title-block__title">{title}</h1>
      {sub && <p className="title-block__sub">{sub}</p>}
    </header>
  );
}

export function RuleTitle({ children, small, link }) {
  return (
    <div className={`rule-title${small ? " rule-title--sm" : ""}`}>
      <span>{children}</span>
      {link && <Link to={link.to} className="rule-title__link">{link.label} ›</Link>}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={i}>{it.to ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageLoader({ error }) {
  return (
    <div className="loader" role="status">
      {error ? (
        <p>Sorry, the catalogue couldn't load. Please refresh the page.</p>
      ) : (
        <>
          <span className="loader__ring" aria-hidden="true" />
          <p>Loading the catalogue…</p>
        </>
      )}
    </div>
  );
}

const STEPS = [
  ["Browse", "Explore every house and open any fragrance for its details and photos."],
  ["Enquire", "Tap “Enquire on WhatsApp”. Your message is filled in with the fragrance and size."],
  ["Confirm", "We confirm availability and arrange delivery or collection from the shop."],
];

export function HowToOrder() {
  return (
    <section className="section section--tint">
      <div className="wrap">
        <RuleTitle>HOW TO ORDER</RuleTitle>
        <ol className="steps">
          {STEPS.map(([h, p], i) => (
            <li key={h}>
              <span className="steps__n">0{i + 1}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function VisitBlock() {
  const { enquire } = useEnquiry();
  return (
    <section className="visit" id="visit">
      <div className="visit__img"><img src={STOREFRONT} alt="The Fragrance Palace shop front" loading="lazy" /></div>
      <div className="visit__body">
        <p className="eyebrow">Visit the shop</p>
        <h2>Smell it before<br />you choose it.</h2>
        <p>Try the testers in store, and let our staff help you find a new signature or the right gift.</p>
        <dl className="visit__info">
          <div><dt>Address</dt><dd>{CONFIG.address}</dd></div>
          <div><dt>Hours</dt><dd>{CONFIG.hours}</dd></div>
          <div><dt>Phone</dt><dd><a href={`tel:${CONFIG.phone}`}>{CONFIG.phoneDisplay}</a></dd></div>
        </dl>
        <div className="hero__ctas">
          <button className="btn btn--dark" onClick={() => enquire()}>Message us on WhatsApp</button>
          {CONFIG.mapUrl && (
            <a className="btn btn--outline" href={CONFIG.mapUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
          )}
        </div>
      </div>
    </section>
  );
}

export function MapBlock() {
  if (!CONFIG.mapEmbed) return null;
  return (
    <section className="map-block" aria-label="Shop location map">
      <iframe
        src={CONFIG.mapEmbed}
        title={`Map showing the ${CONFIG.storeName} shop in ${CONFIG.city}`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
