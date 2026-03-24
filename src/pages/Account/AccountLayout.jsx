import { NavLink, Outlet } from "react-router-dom"
import "./Account.css"

const AccountLayout = () => {
  return (
    <section className="account">
      <div className="account__container content">
        <aside className="account__sidebar" aria-label="Account menu">
          <div className="account_title">My account</div>
          <nav className="account__nav">
            <NavLink
              to="/account/info"
              className={({ isActive }) => (isActive ? "account__link account__link--active" : "account__link")}
            >
              Personal info
            </NavLink>
            <NavLink
              to="/account/bookings"
              className={({ isActive }) => (isActive ? "account__link account__link--active" : "account__link")}
            >
              My bookings
            </NavLink>
          </nav>
        </aside>

        <main className="account__main">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default AccountLayout