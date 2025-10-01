import logo from "../../../assets/icons/logo.svg"
import "./NavBarMenu.css"
import "./NavBar.css"

const NavBar = () => {
  return (
    <nav className="nav">
      <div className="nav__container">
        <a href="#" className="nav__logo"><img src={logo} alt="Logo" /><div><p>Anor</p> <span> Avenue Hotel</span></div></a>
        <ul className="nav__list">
          <li><a href="../../../../../index.html" className="nav__list-item active">Home</a></li>
          <li><a href="#services" className="nav__list-item">About Us</a></li>
          <li><a href="#book" className="nav__list-item">Contact Us</a></li>
          <li><a href="" className="nav__list-item">Blog</a></li>
        </ul>
        <div className="nav__right">
          <button>Book Now</button>
          <select name="lang" id="lang">
            <option value="russian">Русский</option>
            <option value="uzbek">Uzbek</option>
            <option value="english">English</option>
          </select>
        </div>

        {/* <div className="nav__menu">
          <button className="hamburger">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
          <div className="nav__bar_menu">
            <a href="#" className="nav__logo"><img src={logo} alt="Logo" /><div><p>Anor</p> <span> Avenue Hotel</span></div></a>
            <ul className="nav__menu-list">
              <li><a href="../../../../../index.html" className="nav__list-item-menu">Home</a></li>
              <li><a href="#rooms" className="nav__list-item-menu">Rooms</a></li>
              <li><a href="#services" className="nav__list-item-menu">About Us</a></li>
              <li><a href="#book" className="nav__list-item-menu">Contact Us</a></li>
              <li><a href="" className="nav__list-item-menu">Blog</a></li>
            </ul>
          </div>
        </div> */}
      </div>
    </nav>
  )
}
export default NavBar;