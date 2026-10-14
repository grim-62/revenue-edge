import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Shaderbackground from "./components/Shaderbackground";
import RootLayout from "./layouts/RootLayout";
import AboutPage from "./views/About/About";
import ContactPage from "./views/Contact/Contact";
import Home from "./views/Home/Home";
import ServiceDetailPage from "./views/Services/ServiceDetailPage";
import ServicesPage from "./views/Services/ServicesPage";

function ServiceDetailRoute() {
  const { categorySlug, serviceSlug } = useParams();

  return <ServiceDetailPage categorySlug={categorySlug} serviceSlug={serviceSlug} />;
}

function ServicesRoute() {
  const { categorySlug } = useParams();

  return <ServicesPage categorySlug={categorySlug} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <RootLayout>
      <Shaderbackground />
      <ScrollToTop />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service/:categorySlug" element={<ServicesRoute />} />
          <Route path="/service/:categorySlug/:serviceSlug" element={<ServiceDetailRoute />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </RootLayout>
  );
};

export default App;
