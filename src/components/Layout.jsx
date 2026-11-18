import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { CATEGORY_LONG, searchProducts, sortProducts, fold } from "../lib/catalogue.js";
import { useCatalogue } from "../lib/CatalogueContext.jsx";
import { useEnquiry } from "../lib/EnquiryContext.jsx";
import { SearchIcon, WhatsAppIcon } from "./Icons.jsx";
import ProductMedia from "./ProductMedia.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // New page: start at the top and close the mobile menu
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", menuOpen);
  }, [menuOpen]);

  useScrollReveal();

  return (
    <>
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      {menuOpen && <MobileMenu />}
      <main>
        <div className="page-enter" key={pathname}>
          <Outlet />
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

// Soft reveal: each section fades and rises into place as it scrolls into view.
// Content is tagged as it appears (pages load data asynchronously), and nothing
// is hidden when the browser lacks IntersectionObserver or the visitor prefers
// reduced motion.
const REVEAL_SELECTOR = "main section, .footer";

function useScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    const tag = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains("is-in")) return;
        // Nested sections ride along with their parent
        if (el.parentElement?.closest(".reveal")) return;
        el.classList.add("reveal");
        io.observe(el);
      });
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tag);
    };
    tag();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      // Never leave anything stuck invisible
      document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => el.classList.add("is-in"));
    };
  }, []);
}

function Header({ menuOpen, onToggleMenu }) {
  const { enquire } = useEnquiry();
  const { data } = useCatalogue();

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar__inner">
          <span>Authentic designer, niche &amp; Arabian fragrances · Dubai, UAE</span>
          <button className="topbar__link" onClick={() => enquire()}>Enquire on WhatsApp</button>
        </div>
      </div>

      <header className="header">
        <div className="wrap header__inner">
          <Link to="/" className="logo" aria-label="Fragrance Palace home">
            <span className="logo__box"><span>FRAGRANCE</span><span>PALACE</span></span>
            <span className="logo__sub">DUBAI</span>
          </Link>

          <nav className="nav" aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            <div className="nav__mega">
              <NavLink to="/brands">Brands</NavLink>
              {data && <MegaMenu brands={data.brands} />}
            </div>
            <NavLink to="/catalogue">Catalogue</NavLink>
            <Link to="/catalogue?gender=Men">For Him</Link>
            <Link to="/catalogue?gender=Women">For Her</Link>
            <NavLink to="/body-care">Body Care</NavLink>
            <NavLink to="/mind-freak">Mind Freak</NavLink>
            <NavLink to="/visit">Visit Us</NavLink>
          </nav>

          <div className="header__tools">
            <SearchBox />
            <button className="icon-btn wa-btn" onClick={() => enquire()} aria-label="Enquire on WhatsApp">
              <WhatsAppIcon />
            </button>
            <button className="icon-btn menu-btn" onClick={onToggleMenu} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function MegaMenu({ brands }) {
  return (
    <div className="mega">
      <div className="wrap mega__inner">
        {["designer", "niche", "arabian"].map((cat) => (
          <div key={cat} className={`mega__col mega__col--${cat}`}>
            <h4>{CATEGORY_LONG[cat]}</h4>
            <ul>
              {brands.filter((b) => b.category === cat).sort((a, b) => a.name.localeCompare(b.name)).map((b) => (
                <li key={b.slug}><Link to={`/brands/${b.slug}`}>{b.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mega__foot">
          <Link to="/brands" className="btn btn--light btn--sm">All {brands.length} houses ›</Link>
        </div>
      </div>
    </div>
  );
}

function SearchBox({ mobile = false }) {
  const { data } = useCatalogue();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!data || q.trim().length < 2) return null;
    const brands = data.brands.filter((b) => fold(b.name + " " + b.aka).includes(fold(q.trim()))).slice(0, 3);
    const products = sortProducts(searchProducts(data.products, q), "popular").slice(0, 6);
    return { brands, products };
  }, [data, q]);

  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const go = (to) => { setOpen(false); setQ(""); navigate(to); };
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) go(`/catalogue?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form className={`search${mobile ? " search--mobile" : ""}`} onSubmit={submit} ref={boxRef} role="search">
      <label>
        <span className="sr-only">Search fragrances</span>
        <input
          type="search"
          placeholder="SEARCH"
          autoComplete="off"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        />
      </label>
      <button type="submit" className="search__go" aria-label="Search"><SearchIcon /></button>

      {open && suggestions && (
        <div className="suggest">
          {suggestions.brands.map((b) => (
            <button type="button" key={b.slug} className="suggest__brand" onClick={() => go(`/brands/${b.slug}`)}>
              <span>House</span>{b.name}<em>{b.count}</em>
            </button>
          ))}
          {suggestions.products.map((p) => (
            <button type="button" key={p.id} className="suggest__item" onClick={() => go(`/product/${p.id}`)}>
              <span className="suggest__img"><ProductMedia product={p} /></span>
              <span><small>{p.brand}</small>{p.name}</span>
            </button>
          ))}
          {!suggestions.brands.length && !suggestions.products.length && <p className="suggest__none">No matches. Try another name.</p>}
          {suggestions.products.length > 0 && (
            <button type="submit" className="suggest__all">See all results for “{q}” ›</button>
          )}
        </div>
      )}
    </form>
  );
}

function MobileMenu() {
  const { enquire } = useEnquiry();
  return (
    <div className="drawer">
      <div className="drawer__search"><SearchBox mobile /></div>
      <nav aria-label="Mobile">
        <Link to="/">Home</Link>
        <Link to="/brands">Brands</Link>
        <Link to="/catalogue">Catalogue</Link>
        <Link to="/catalogue?gender=Men">For Him</Link>
        <Link to="/catalogue?gender=Women">For Her</Link>
        <Link to="/body-care">Body Care</Link>
        <Link to="/mind-freak">Mind Freak</Link>
        <Link to="/visit">Visit Us</Link>
        <button className="btn btn--light" onClick={() => enquire()}>Enquire on WhatsApp</button>
      </nav>
    </div>
  );
}

function Footer() {
  const { enquire } = useEnquiry();
  const { data } = useCatalogue();
  const top = data ? [...data.brands].sort((a, b) => b.count - a.count).slice(0, 12) : [];
  return (
    <footer className="footer">
      <div className="footer__top wrap">
        <div className="footer__cta">
          <WhatsAppIcon />
          <span>Can't find a fragrance? We can source it.</span>
          <button className="btn btn--dark btn--sm" onClick={() => enquire()}>Ask on WhatsApp ›</button>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="wrap footer__bottom-inner">
          <div className="footer__cols">
            <nav aria-label="Footer">
              <h4>Explore</h4>
              <Link to="/">Home</Link>
              <Link to="/brands">All brands</Link>
              <Link to="/catalogue">Catalogue</Link>
              <Link to="/catalogue?cat=arabian">Arabian perfumery</Link>
              <Link to="/catalogue?cat=niche">Niche houses</Link>
              <Link to="/mind-freak">Mind Freak, our own brand</Link>
              <Link to="/visit">Visit us</Link>
            </nav>
            <nav aria-label="Popular brands" className="footer__brands">
              <h4>Popular houses</h4>
              {top.map((b) => <Link key={b.slug} to={`/brands/${b.slug}`}>{b.name}</Link>)}
            </nav>
          </div>
          <p>
            © {new Date().getFullYear()} Fragrance Palace, Dubai. Brand names and product images are trademarks
            of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  const { enquire } = useEnquiry();
  return (
    <button className="fab" onClick={() => enquire()} aria-label="Enquire on WhatsApp">
      <WhatsAppIcon fill="#fff" />
    </button>
  );
}
