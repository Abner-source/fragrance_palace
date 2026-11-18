import { Route, Routes } from "react-router";
import { CatalogueProvider } from "./lib/CatalogueContext.jsx";
import { EnquiryProvider } from "./lib/EnquiryContext.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Brands from "./pages/Brands.jsx";
import Brand from "./pages/Brand.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import Product from "./pages/Product.jsx";
import Visit from "./pages/Visit.jsx";
import BodyCare from "./pages/BodyCare.jsx";
import MindFreak from "./pages/MindFreak.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <CatalogueProvider>
      <EnquiryProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:slug" element={<Brand />} />
            <Route path="catalogue" element={<Catalogue />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="body-care" element={<BodyCare />} />
            <Route path="mind-freak" element={<MindFreak />} />
            <Route path="visit" element={<Visit />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </EnquiryProvider>
    </CatalogueProvider>
  );
}
