import { HowToOrder, MapBlock, TitleBlock, VisitBlock, useTitle } from "../components/Sections.jsx";

export default function Visit() {
  useTitle("Visit us");
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <TitleBlock kicker="Visit" title="THE SHOP" sub="Our shop is in Dubai. Come in to try the testers, or message us to order." />
        </div>
      </section>
      <VisitBlock />
      <MapBlock />
      <HowToOrder />
    </>
  );
}
