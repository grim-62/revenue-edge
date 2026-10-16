import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import Shaderbackground from "./components/Shaderbackground";
import RootLayout from "./layouts/RootLayout";
import Home from "./views/Home/Home";

const AboutPage = lazy(() => import("./views/About/About"));
const ContactPage = lazy(() => import("./views/Contact/Contact"));
const NotFoundPage = lazy(() => import("./views/NotFound"));
const ServiceDetailPage = lazy(() => import("./views/Services/ServiceDetailPage"));
const ServicesPage = lazy(() => import("./views/Services/ServicesPage"));
const ServiceCategoryPage = lazy(() => import("./views/Services/ServiceCategoryPage"));

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
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const id = requestAnimationFrame(() => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
const WrapperRootLayout = ({ children }) => {
  return (
    <RootLayout>
      <Shaderbackground />
      <ScrollToTop />
      <div className="relative z-10">{children || <Outlet />}</div>
    </RootLayout>
  );
};
const App = () => {
  return (
    
        <Routes>
          <Route element={<WrapperRootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Suspense fallback={null}><ServicesPage /></Suspense>} />
            <Route path="/service/:categorySlug" element={<Suspense fallback={null}><ServiceCategoryRoute /></Suspense>} />
            <Route path="/service/:categorySlug/:serviceSlug" element={<Suspense fallback={null}><ServiceDetailRoute /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={null}><AboutPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={null}><ContactPage /></Suspense>} />
          </Route>
          <Route path="*" element={<Suspense fallback={null}><NotFoundPage /></Suspense>} />
        </Routes>
  
  );
};

export default App;
