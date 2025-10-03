import "./Footer.css"
import logo from "../../assets/icons/logo.svg";
import loc from "../../assets/icons/footer/location.svg";
import con from "../../assets/icons/footer/contacts.svg";
import email from "../../assets/icons/footer/email.svg";
import tg from "../../assets/icons/footer/telegram3.svg";
import inst from "../../assets/icons/footer/instagram.svg";
import facebook from "../../assets/icons/footer/facebook.svg";

const Footer = () => {
    return (
        <footer className="footer ">
            <div className="footer__container content">
                <div className="footer__logo-container">
                    <span className="footer__logo"><img src={logo} alt="Logo" />Anor Avenue Hotel</span>
                    <p>Itawa is a responsive real estate landing page template.Itawa is a  landing page template.Itawa template.</p>
                </div>
                <div className="footer__contacts">
                    <h2>Contact Us</h2>
                    <div className="footer__contacts-links">
                        <a href="#"><img src={loc} alt="location" /> 123 Business Centre London SW1A 1AA</a>
                        <a href="#"><img src={con} alt="contacts" /> +1 0000 000 00</a>
                        <a href="#"><img src={email} alt="email" />info@businessname.com</a>
                    </div>
                </div>
                <div className="footer__socials">
                    <h2>Follow Us</h2>
                    <div className="footer__socials-icons">
                        <div className="icons">
                            <img width={30} src={tg} alt="" />
                        </div>
                          <div className="icons">
                            <img width={28} src={inst} alt="" />
                        </div>
                          <div className="icons">
                            <img width={30} src={facebook} alt="" />
                        </div>
                    </div>
                    <p>Itawa is a responsive real estate landing page template.Itawa is a  landing page template.Itawa
                    template.</p>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="footer__bottom-container content">
                    <p>© Anor Avenue Hotel, 2025</p>
                    <div>
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/terms-of-service">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;