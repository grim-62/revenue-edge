import Shaderbackground from "./components/Shaderbackground";
import RootLayout from "./layouts/RootLayout";
import Home from "./views/Home/Home";
import ServiceDetailPage from "./views/Services/ServiceDetailPage";
import ServicesPage from "./views/Services/ServicesPage";

const App = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const serviceRoute = path.match(/^\/service\/([^/]+)(?:\/([^/]+))?$/);

  let page = <Home />;
  if (path === "/services") {
    page = <ServicesPage />;
  } else if (serviceRoute?.[2]) {
    page = <ServiceDetailPage categorySlug={serviceRoute[1]} serviceSlug={serviceRoute[2]} />;
  } else if (serviceRoute?.[1]) {
    page = <ServicesPage categorySlug={serviceRoute[1]} />;
  }

  return (
    <RootLayout>
      <Shaderbackground />
      <div className="relative z-10">{page}</div>
    </RootLayout>
  );
};

export default App;
