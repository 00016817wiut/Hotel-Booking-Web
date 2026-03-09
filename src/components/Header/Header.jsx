
import "./Header.css";




const Header = () => {


  return (
    <header className="hero">
      <div className="hero__overlay" />
      <div className="hero__atlas" />
      <div className="hero__glow hero__glow--left" />
      <div className="hero__glow hero__glow--right" />

      <div className="hero__container content">
        <div className="hero__content">
          <p className="hero__eyebrow">Anor hospitality in Tashkent</p>
          <h1 className="hero__title">Warm Uzbek elegance, inspired by the color and spirit of pomegranate.</h1>
          <p className="hero__descr">
            Enjoy bright interiors with atlas-inspired curves, thoughtful comfort, and heartfelt service that makes every stay feel festive and relaxed.
          </p>

          <div className="hero__actions">
            <a href="/rooms" className="hero__button hero__button--primary">
              Explore rooms
            </a>
            <a href="/#book" className="hero__button hero__button--ghost">
              Contact booking
            </a>
          </div>
        </div>

        <form className="hero__booking" aria-label="Booking form">
          <h2>Book your stay</h2>
          <label>
            Check-in
            <input type="date" />
          </label>
          <label>
            Check-out
            <input type="date" />
          </label>
          <label>
            Guests
            <select defaultValue="2">
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
            </select>
          </label>
          <button type="button">Check availability</button>
        </form>
      </div>
    </header>
  );
};

export default Header;
