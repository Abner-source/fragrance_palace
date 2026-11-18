import { Link } from "react-router";
import { TitleBlock, useTitle } from "../components/Sections.jsx";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <section className="section">
      <div className="wrap notfound">
        <TitleBlock kicker="404" title="NOT FOUND" sub="That page doesn't exist, or the fragrance is no longer listed." />
        <div className="hero__ctas">
          <Link className="btn btn--dark" to="/brands">Browse brands</Link>
          <Link className="btn btn--outline" to="/catalogue">Search the catalogue</Link>
        </div>
      </div>
    </section>
  );
}
