import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Outlet, Route, Routes, useLocation, useOutletContext, useParams } from "react-router-dom";
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
const AdminLoginPage = lazy(() => import("./views/auth/Adminloginpage"));
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
  return (
    
        <Routes>
          <Route element={<WrapperRootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Suspense fallback={null}><ServicesPage /></Suspense>} />
            <Route path="/service/:categorySlug" element={<Suspense fallback={null}><ServiceCategoryRoute /></Suspense>} />
            <Route path="/service/:categorySlug/:serviceSlug" element={<Suspense fallback={null}><ServiceDetailRoute /></Suspense>} />
            <Route path="/about" element={<Suspense fallback={null}><AboutPage /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={null}><ContactPage /></Suspense>} />
            <Route path="/careers" element={<Suspense fallback={null}><CareerPage /></Suspense>} />
            <Route path='/review' element={<Suspense fallback={null}><ReviewsPage /></Suspense>} />
          </Route>
            <Route path='/admin/login' element={<Suspense fallback={null}><AdminLoginPage /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={null}><AdminDashboard /></Suspense>}>
            <Route index element={<Suspense fallback={null}><AdminOverviewRoute /></Suspense>} />
            <Route path="careers" element={<Suspense fallback={null}><AdminCareerRoute /></Suspense>} />
            <Route path="inquiries" element={<Suspense fallback={null}><AdminInquiryRoute /></Suspense>} />
            <Route path="reviews" element={<Suspense fallback={null}><AdminReviewRoute /></Suspense>} />
          </Route>
          <Route path="*" element={<Suspense fallback={null}><NotFoundPage /></Suspense>} />
        </Routes>
  
  );
};

export default App;
