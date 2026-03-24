import { NavLink, Outlet } from "react-router-dom";
import "./Admin.css";

const AdminLayout = () => {
  return (
    <section className="admin">
      <div className="admin__container content">
        <aside className="admin__sidebar" aria-label="Admin menu">
          <div className="admin__title">Admin</div>

          <nav className="admin__nav">
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) => (isActive ? "admin__link admin__link--active" : "admin__link")}
            >
              Bookings
            </NavLink>
            <NavLink
              to="/admin/rooms"
              className={({ isActive }) => (isActive ? "admin__link admin__link--active" : "admin__link")}
            >
              Rooms
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "admin__link admin__link--active" : "admin__link")}
            >
              Users
            </NavLink>
          </nav>
        </aside>

        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default AdminLayout;
