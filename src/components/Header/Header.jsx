import NavBar from "../NavBar/NavBar";
import "./Header.css";

import { Swiper, SwiperSlide, } from "swiper/react";
import "swiper/css";
import { Scrollbar, Autoplay } from 'swiper/modules';


const Header = () => {
  return (
    <>
    <header className="header">
      <div className="header__container content">
        <div className="header__info">
          <div className="header__info-title">Discover a hotel
            that defies a new
            dimension of luxury.</div>
          <div className="header__info-descr">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy.</div>
          <a href="#rooms" class="header__info-button">Get Started</a>
        </div>
        </div>
    </header>
    </>
  )
}
export default Header;