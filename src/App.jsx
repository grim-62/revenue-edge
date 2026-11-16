import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, Route, Routes, useLocation, useOutletContext, useParams } from "react-router-dom";
import Loader from "./components/Loader";
import Shaderbackground from "./components/Shaderbackground";
import RootLayout from "./layouts/RootLayout";
import Home from "./views/Home/Home";
import ReviewsPage from "./views/Review/Reviewspage";

const AboutPage = lazy(() => import("./views/About/About"));
const ContactPage = lazy(() => import("./views/Contact/Contact"));
const NotFoundPage = lazy(() => import("./views/NotFound"));
const ServiceDetailPage = lazy(() => import("./views/Services/ServiceDetailPage"));
const ServicesPage = lazy(() => import("./views/Services/ServicesPage"));
const ServiceCategoryPage = lazy(() => import("./views/Services/ServiceCategoryPage"));
const CareerPage = lazy(() => import("./views/Career/Careerspage"));
const AdminDashboard = lazy(() => import("./views/Admin/AdminDashboard"));
const AdminLoginPage = lazy(() => import("./views/Auth/AdminLoginPage"));
const AdminOverview = lazy(() => import("./views/Admin/AdminOverview"));
const AdminCareer = lazy(() => import("./views/Admin/AdminCareer"));
const AdminInquiry = lazy(() => import("./views/Admin/AdminInquiry"));
const AdminReview = lazy(() => import("./views/Admin/AdminReview"));

function AdminOverviewRoute() {
  const { roles, applications, reviews, onPatchReview } = useOutletContext();
  return <AdminOverview roles={roles} applications={applications} reviews={reviews} onPatchReview={onPatchReview} />;
}

function AdminCareerRoute() {
  const { roles, applications, onSaveRole, onSetRoleStatus, onDeleteRole } = useOutletContext();
  return <AdminCareer roles={roles} applications={applications} onSaveRole={onSaveRole} onSetRoleStatus={onSetRoleStatus} onDeleteRole={onDeleteRole} />;
}

function AdminInquiryRoute() {
  const { applications, onUpdateApplication } = useOutletContext();
  return <AdminInquiry applications={applications} onUpdateApplication={onUpdateApplication} />;
}

function AdminReviewRoute() {
  const { reviews, onPatchReview, onDeleteReview } = useOutletContext();
  return <AdminReview reviews={reviews} onPatchReview={onPatchReview} onDeleteReview={onDeleteReview} />;
}

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
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.scrollTo(0, 0);
      setIsStarting(false);
    }, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {isStarting && <Loader fullScreen />}
        <Routes>
          <Route element={<WrapperRootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Suspense fallback={<Loader fullScreen />}><ServicesPage /></Suspense>} />
            <Route path="/service/:categorySlug" element={<Suspense fallback={<Loader fullScreen />}><ServiceCategoryRoute /></Suspense>} />
            <Route path="/service/:categorySlug/:serviceSlug" element={<Suspense fallback={<Loader fullScreen />}><ServiceDetailRoute /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<Loader fullScreen />}><AboutPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<Loader fullScreen />}><ContactPage /></Suspense>} />
            <Route path="/careers" element={<Suspense fallback={<Loader fullScreen />}><CareerPage /></Suspense>} />
            <Route path='/review' element={<Suspense fallback={<Loader fullScreen />}><ReviewsPage /></Suspense>} />
          </Route>
            <Route path='/admin/login' element={<Suspense fallback={<Loader fullScreen />}><AdminLoginPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={<Loader fullScreen />}><AdminDashboard /></Suspense>}>
            <Route index element={<Suspense fallback={<Loader fullScreen />}><AdminOverviewRoute /></Suspense>} />
            <Route path="careers" element={<Suspense fallback={<Loader fullScreen />}><AdminCareerRoute /></Suspense>} />
            <Route path="inquiries" element={<Suspense fallback={<Loader fullScreen />}><AdminInquiryRoute /></Suspense>} />
            <Route path="reviews" element={<Suspense fallback={<Loader fullScreen />}><AdminReviewRoute /></Suspense>} />
          </Route>
          <Route path="*" element={<Suspense fallback={<Loader fullScreen />}><NotFoundPage /></Suspense>} />
        </Routes>
    </>
  );
};

export default App;
