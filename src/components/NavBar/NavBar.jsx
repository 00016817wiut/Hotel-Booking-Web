import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import logo from "../../assets/icons/logo.jpg";
import profile from "../../assets/icons/profile.svg"
import "./NavBar.css";
import "./NavBarMenu.css";
import { routeLinks, sectionLinks } from "../../utils/navRoutes.js";
import { useLockBodyScroll, useScrollToHash } from "../../hooks/base.js";


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useScrollToHash(location)
  const closeMenu = () => setIsMenuOpen(false);
  useLockBodyScroll(isMenuOpen);


  return (
    <>
      <nav className="nav">
        <div className="nav__container content">
          <Link to="/" className="nav__logo" aria-label="Go to homepage">
            <img src={logo} alt="Anor Avenue Hotel logo" className="nav__logo-image" />
            <div className="nav__brand">
              <span className="nav__brand-name">Anor</span>
              <span className="nav__brand-sub">Avenue Hotel</span>
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

            {!user && (
              <Link
                className="nav__auth"
                to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`}
              >
                Login
              </Link>
            )}
            {user &&
              <Link to={`/account`}>
                <img src={profile} alt="" width={25} />
              </Link>
            }
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
              <div className="nav__brand">
                <span className="nav__brand-name">Anor</span>
                <span className="nav__brand-sub">Avenue Hotel</span>
              </div>
            </Link>
            <button className="nav__close" type="button" onClick={closeMenu} aria-label="Close mobile menu">
              x
            </button>
          </div>

          <ul className="nav__menu-list">
            {user &&
              <li key="mobile-account">
                <NavLink to={`/account`}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "nav__list-item-menu nav__list-item-menu--active"
                      : "nav__list-item-menu"
                  }>
                  Profile
                </NavLink>
              </li>
            }
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

            {!user && (
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
