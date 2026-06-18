import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../Footer/Footer.jsx";
import NavBar from "../NavBar/NavBar.jsx";

const Layout = () => {
  return (
    <div className="box-config">
      <NavBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#111111",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#1f9d55",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#A8843D",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <div className="outlet-box">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
