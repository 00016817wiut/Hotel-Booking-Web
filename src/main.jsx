// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import App from "./App.jsx";
import Rooms from "./components/Rooms/Rooms.jsx";
import RoomDetails from "./components/Rooms/RoomDetails.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/Privacy.jsx";
import TermsOfService from "./components/TermsOfService/TermsOfService.jsx";
import Layout from "./components/Layout/Layout.jsx";
import AuthProvider from "./auth/AuthProvider.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import RequireAuth from "./routes/RequiresAuth.jsx";
import AccountLayout from "./pages/Account/AccountLayout.jsx";
import AccountInfo from "./pages/Account/AccountInfo.jsx";
import AccountBookings from "./pages/Account/AccountBookings.jsx";
import AccountRooms from "./pages/Account/AccountRooms.jsx";
import AccountUsers from "./pages/Account/AccountUsers.jsx";
import "./assets/fonts/fonts.css";
import "./assets/styles/root.css";
import "./assets/styles/common.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "rooms", element: <Rooms /> },
      { path: "room/:id", element: <RoomDetails /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "account",
        element: (
          <RequireAuth>
            <AccountLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/account/info" replace /> },
          { path: "info", element: <AccountInfo /> },
          { path: "bookings", element: <AccountBookings /> },
          { path: "rooms", element: <AccountRooms /> },
          { path: "users", element: <AccountUsers /> },
        ],
      },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
