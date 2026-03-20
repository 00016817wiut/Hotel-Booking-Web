import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import logo from "../../assets/icons/logo.jpg";
import "./NavBar.css";
import "./NavBarMenu.css";

const routeLinks = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
];

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Facilities", href: "/#services" },
  { label: "FAQ", href: "/#faq" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const isReload = performance.getEntriesByType("navigation")[0].type === "reload"

    if (isReload) {
      window.scrollTo(0, 0)
      return
    }
    else {
      if (location.hash) {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
        }
      }
      
      if (location.pathname === "/rooms") {
        window.scrollTo(0, 0)
      }
    }
  }, [location])

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="nav">
        <div className="nav__container content">
          <Link to="/" className="nav__logo" aria-label="Go to homepage">
            <img src={logo} alt="Anor Avenue Hotel logo" className="nav__logo-image" />
            <div>
              <p>Anor</p>
              <span>Avenue Hotel</span>
            </div>
          </Link>

          <ul className="nav__list">
            {routeLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? "nav__list-item nav__list-item--active" : "nav__list-item"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav__list-item">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__right">
            <a className="nav__book-button" href="/#contact">
              Book now
            </a>

            {user ? (
              <button type="button" className="nav__auth" onClick={logout}>
                Logout
              </button>
            ) : (
              <Link
                className="nav__auth"
                to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
              >
                Login
              </Link>
            )}
          </div>

          <div className="nav__menu">
            <button
              className={`hamburger ${isMenuOpen ? "hamburger--active" : ""}`}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label="Open mobile menu"
              type="button"
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav__mobile ${isMenuOpen ? "nav__mobile--open" : ""}`}>
        <div className="nav__mobile-overlay" onClick={closeMenu} />
        <div className="nav__bar_menu">
          <div className="nav__bar-top">
            <Link to="/" className="nav__logo" onClick={closeMenu}>
              <img src={logo} alt="Anor Avenue Hotel logo" />
              <div>
                <p>Anor</p>
                <span>Avenue Hotel</span>
              </div>
            </Link>
            <button className="nav__close" type="button" onClick={closeMenu} aria-label="Close mobile menu">
              x
            </button>
          </div>

          <ul className="nav__menu-list">
            {routeLinks.map((link) => (
              <li key={`mobile-${link.to}`}>
                <NavLink
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "nav__list-item-menu nav__list-item-menu--active"
                      : "nav__list-item-menu"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {sectionLinks.map((link) => (
              <li key={`mobile-${link.href}`}>
                <a href={link.href} className="nav__list-item-menu" onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__mobile-actions">
            <a className="nav__book-button" href="/#contact" onClick={closeMenu}>
              Book now
            </a>

            {user ? (
              <button
                type="button"
                className="nav__auth"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                className="nav__auth"
                to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
