import { useEffect } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Shaderbackground from "./components/Shaderbackground";
import RootLayout from "./layouts/RootLayout";
import AboutPage from "./views/About/About";
import ContactPage from "./views/Contact/Contact";
import Home from "./views/Home/Home";
import NotFoundPage from "./views/NotFound";
import ServiceDetailPage from "./views/Services/ServiceDetailPage";
import ServicesPage from "./views/Services/ServicesPage";
import ServiceCategoryPage from "./views/Services/ServiceCategoryPage";

gsap.registerPlugin(ScrollTrigger);

function ServiceDetailRoute() {
  const { categorySlug, serviceSlug } = useParams();

  return (
    <ServiceDetailPage
      key={`${categorySlug}/${serviceSlug}`}
      categorySlug={categorySlug}
      serviceSlug={serviceSlug}
    />
  );
}

function ServiceCategoryRoute() {
  const { categorySlug } = useParams();

  return (
    <ServiceCategoryPage
      key={categorySlug}
      categorySlug={categorySlug}
    />
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
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
          <Route path="/service/:categorySlug" element={<ServiceCategoryRoute />} />
          <Route path="/service/:categorySlug/:serviceSlug" element={<ServiceDetailRoute />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </RootLayout>
  );
};

export default App;
