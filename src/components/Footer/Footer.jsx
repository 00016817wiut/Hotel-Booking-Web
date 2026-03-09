import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/icons/logo.svg";
import loc from "../../assets/icons/footer/location.svg";
import con from "../../assets/icons/footer/contacts.svg";
import email from "../../assets/icons/footer/email.svg";
import tg from "../../assets/icons/footer/telegram3.svg";
import inst from "../../assets/icons/footer/instagram.svg";
import facebook from "../../assets/icons/footer/facebook.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content">
        <div className="footer__container">
          <div className="footer__logo-container">
            <span className="footer__logo">
              <img src={logo} alt="Anor Avenue Hotel logo" />
              Anor Avenue Hotel
            </span>
            <p>
              A modern boutique hotel in Tashkent focused on comfortable stays, elegant interiors, and warm hospitality for every guest.
            </p>
          </div>

          <div className="footer__contacts">
            <h2>Contact us</h2>
            <div className="footer__contacts-links">
              <a href="https://maps.app.goo.gl" target="_blank" rel="noreferrer">
                <img src={loc} alt="Location icon" />
                Tashkent, Uzbekistan
              </a>
              <a href="tel:+998777673000">
                <img src={con} alt="Phone icon" />
                +998 (77) 767 30 00
              </a>
              <a href="mailto:info@anoravenue.uz">
                <img src={email} alt="Email icon" />
                info@anoravenue.uz
              </a>
            </div>
          </div>

          <div className="footer__socials">
            <h2>Follow us</h2>
            <div className="footer__socials-icons">
              <a className="icons" href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
                <img src={tg} alt="Telegram" />
              </a>
              <a className="icons" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <img src={inst} alt="Instagram" />
              </a>
              <a className="icons" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <img src={facebook} alt="Facebook" />
              </a>
            </div>
            <p>Stay updated with seasonal offers, room updates, and travel inspiration from Anor Avenue Hotel.</p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-container content">
          <p>© Anor Avenue Hotel, 2026</p>
          <div>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
