import NavBar from "./NavBar/NavBar";
import "./Header.css";
import payment from "../../assets/icons/payment.svg"


const Header = () => {
  return (
    <>
    <NavBar/>
    <header className="header">
      <div className="header-bg"></div>
      <div className="header__container content">
        <div className="header__info">
          <div className="header__info-title">Discover a hotel
            that defies a new
            dimension of luxury.</div>
          <div className="header__info-descr">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</div>
          <a href="#rooms" class="header__info-button">Get Started</a>
        </div>
      </div>
      <div className="header__circles"></div>
      <div className="header__hotel"></div>

      <div className="header__payment">
        <img src={payment} alt="payment" className="payment" />
        <div className="header__payment-info">
          <h3>Payment</h3>
          <p>on onternet</p>
        </div>
      </div>
    </header>
    </>
  )
}
export default Header;