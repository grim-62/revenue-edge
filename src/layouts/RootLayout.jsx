import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const RootLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;