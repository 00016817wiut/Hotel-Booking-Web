import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
import NavBar from "../NavBar/NavBar.jsx";

const Layout = () => {
  return (
    <div className="box-config">
      <NavBar />
      <div className="outlet-box">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
