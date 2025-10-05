// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import App from "./App.jsx";
import Rooms from "./components/Rooms/Rooms.jsx";
import RoomDetails from "./components/Rooms/RoomDetails.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Footer from "./components/Footer/Footer.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import "./assets/styles/root.css";

const Layout = () => (
  <div className="box-config">
    <NavBar />
    <div className="outlet-box">
      <Outlet  />  
    </div>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",             
    element: <Layout />,    
    children: [
      { index: true, element: <App /> },           
      { path: "rooms", element: <Rooms /> },       
      { path: "room/:id", element: <RoomDetails /> }, 
      { path: "*", element: <PageNotFound /> }, 
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
