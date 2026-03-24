import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Account.css";

const AccountLayout = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.profile?.role || "").toLowerCase() === "admin";

  return (
    <section className="account">
      <div className="account__container content">
        <aside className="account__sidebar" aria-label="Account menu">
          <div className="account_title">My account</div>

          <nav className="account__nav">
            <NavLink
              to="/account/info"
              className={({ isActive }) =>
                isActive ? "account__link account__link--active" : "account__link"
              }
            >
              Personal info
            </NavLink>
            <NavLink
              to="/account/bookings"
              className={({ isActive }) =>
                isActive ? "account__link account__link--active" : "account__link"
              }
            >
              My bookings
            </NavLink>

            {isAdmin && (
              <>
                <div className="account__divider">Admin</div>
                <NavLink
                  to="/account/bookings"
                  end
                  className={({ isActive }) =>
                    isActive ? "account__link account__link--active" : "account__link"
                  }
                >
                  All bookings
                </NavLink>
                <NavLink
                  to="/account/rooms"
                  className={({ isActive }) =>
                    isActive ? "account__link account__link--active" : "account__link"
                  }
                >
                  Rooms
                </NavLink>
                <NavLink
                  to="/account/users"
                  className={({ isActive }) =>
                    isActive ? "account__link account__link--active" : "account__link"
                  }
                >
                  Users
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        <main className="account__main">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default AccountLayout;
