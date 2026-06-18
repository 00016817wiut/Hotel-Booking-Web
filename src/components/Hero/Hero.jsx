import "./Hero.css";
import { useNavigate } from "react-router-dom";
import BookingSearch from "../BookingSearch/BookingSearch.jsx";




const Hero = () => {
  const navigate = useNavigate();

  const onSearch = ({ checkIn, checkOut, guests, roomType }) => {
    const params = new URLSearchParams({ checkIn, checkOut, guests });
    if (roomType && roomType !== "any") params.set("roomType", roomType);
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="hero">
      <div className="hero__overlay" />
      <div className="hero__container content">
        <div className="hero__content">
          <span className="hero__badge">Premium Comfort</span>
          <h1 className="hero__title">
            Where Luxury
            <br />
            Meets <span className="hero__title-accent">Serenity</span>
          </h1>
          <p className="hero__descr">
            Discover an unparalleled retreat in the heart of the city. From comfortable rooms to attentive service, every moment at Anor Avenue Hotel is crafted for you.
          </p>

          <div className="hero__actions">
            <a href="/rooms" className="hero__button hero__button--primary">
              Explore rooms
            </a>
            <a href="/#about" className="hero__button hero__button--outline">
              Discover more
            </a>
          </div>
        </div>
        <div className="hero__booking-bar">
          <BookingSearch
            variant="bar"
            onSubmit={onSearch}
            showRoomType
            roomTypes={["Single", "Twin", "Deluxe", "Family"]}
          />
        </div>
      </div>
      <div className="hero__scroll-indicator">Scroll to explore</div>
    </div>
  );
};

export default Hero;
