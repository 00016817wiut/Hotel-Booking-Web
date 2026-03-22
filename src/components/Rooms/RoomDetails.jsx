import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import roomsInfo from "./data/roomsInfo.js";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const rootRef = useRef(null);
  const backToRooms = location.search ? `/rooms${location.search}` : "/rooms";
  const room = roomsInfo.find((item) => String(item.id) === id);

  const gallery = useMemo(() => {
    const imgs = Array.isArray(room?.gallery) && room.gallery.length ? room.gallery : room?.image ? [room.image] : [];
    return imgs;
  }, [room]);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    Fancybox.bind(rootEl, "[data-fancybox='room-gallery']", {
      animated: true,
      dragToClose: true,
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["close"],
        },
      },
    });

    return () => {
      Fancybox.unbind(rootEl);
      Fancybox.close();
    };
  }, [id]);

  if (!room) {
    return (
      <section className="room-details room-details--missing content">
        <h1>Room not found</h1>
        <p>The selected room does not exist or has been removed.</p>
        <Link to={backToRooms} className="room-details__button">
          Back to rooms
        </Link>
      </section>
    );
  }

  return (
    <section className="room-details">
      <div className="room-details-container content" ref={rootRef}>
        <div className="room-details__media">
          <a
            className="room-details__image-link"
            href={gallery[0]}
            data-fancybox="room-gallery"
            data-caption={room.title}
            aria-label="Open room photo"
          >
            <img src={gallery[0]} alt={room.title} className="room-details__image" />
          </a>
          {gallery.length > 1 ? (
            <div className="room-details__thumbs" aria-label="Room photos">
              {gallery.slice(0, 6).map((src, i) => (
                <a
                  key={`${src}-${i}`}
                  className="room-details__thumb"
                  href={src}
                  data-fancybox="room-gallery"
                  data-caption={room.title}
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img src={src} alt="" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

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
            <a href="/#contact" className="room-details__button">
              Request booking
            </a>
            <Link to={backToRooms} className="room-details__link">
              View all rooms
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
