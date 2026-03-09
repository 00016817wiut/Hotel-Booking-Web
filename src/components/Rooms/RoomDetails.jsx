import { Link, useParams } from "react-router-dom";
import roomsInfo from "./data/roomsInfo.js";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const room = roomsInfo.find((item) => String(item.id) === id);

  if (!room) {
    return (
      <section className="room-details room-details--missing content">
        <h1>Room not found</h1>
        <p>The selected room does not exist or has been removed.</p>
        <Link to="/rooms" className="room-details__button">
          Back to rooms
        </Link>
      </section>
    );
  }

  return (
    <section className="room-details">
      <div className="room-details-container content">
        <img src={room.image} alt={room.title} className="room-details__image" />

        <div className="room-details__info">
          <p className="room-details__badge">Room #{room.id}</p>
          <h1>{room.title}</h1>
          <p>
            A spacious and elegant setup for guests who value comfort, natural lighting, and practical amenities for short or extended stays.
          </p>

          <ul>
            <li>{room.size}</li>
            <li>{room.beds}</li>
            <li>{room.bath}</li>
          </ul>

          <p className="room-details__price">
            {room.price} <span>/ night</span>
          </p>

          <div className="room-details__actions">
            <a href="/#book" className="room-details__button">
              Request booking
            </a>
            <Link to="/rooms" className="room-details__link">
              View all rooms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
