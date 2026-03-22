import "./Rooms.css";
import { Link, useSearchParams } from "react-router-dom";
import size from "../../assets/icons/size.svg";
import bed from "../../assets/icons/bed.svg";
import bath from "../../assets/icons/bath.svg";
import roomsInfo from "./data/roomsInfo.js";
import BookingSearch from "../BookingSearch/BookingSearch.jsx";
import { isRoomAvailable } from "../../utils/availability.js";

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "";
  const roomTypeParam = searchParams.get("roomType") || "any";
  const guests = guestsParam ? Number(guestsParam) : 0;

  const hasDateFilter = Boolean(checkIn && checkOut);
  const hasGuestFilter = Number.isFinite(guests) && guests > 0;

  const filteredRooms = roomsInfo.filter((room) => {
    if (hasGuestFilter && (room.capacity ?? 0) < guests) return false;
    if (hasDateFilter && !isRoomAvailable(room, checkIn, checkOut)) return false;
    if (roomTypeParam && roomTypeParam !== "any" && String(room.type || "").toLowerCase() !== roomTypeParam.toLowerCase()) {
      return false;
    }
    return true;
  });

  const onSearch = ({ checkIn: ci, checkOut: co, guests: g, roomType }) => {
    const next = { checkIn: ci, checkOut: co, guests: g };
    if (roomType && roomType !== "any") next.roomType = roomType;
    setSearchParams(next);
  };

  const roomTypes = Array.from(new Set(roomsInfo.map((r) => r.type).filter(Boolean))).sort();

  return (
    <section className="rooms" id="rooms">
      <div className="rooms__container content">
        <div className="rooms__header">
          <h1>Available Rooms</h1>
          <p>
            {hasDateFilter || hasGuestFilter
              ? `${filteredRooms.length} room(s) match your search.`
              : "Browse all rooms or search by dates and guests."}
          </p>
        </div>

        <div className="rooms__search">
          <BookingSearch
            variant="inline"
            title="Filter rooms"
            defaultValues={{
              ...(checkIn ? { checkIn } : {}),
              ...(checkOut ? { checkOut } : {}),
              guests: guestsParam || "2",
              roomType: roomTypeParam,
            }}
            onSubmit={onSearch}
            showRoomType
            roomTypes={roomTypes}
          />
        </div>

        <div className="rooms__body">
          {filteredRooms.map((room) => (
            <Link to={`/room/${room.id}?${searchParams.toString()}`} className="rooms__body-item" key={room.id}>

              <div className="room__image">
                <img src={room.image} alt={room.title} />
              </div>

              <div className="room__info">
                <h1>{room.title}</h1>
                <ul>
                  <li>
                    <img src={size} alt="" aria-hidden="true" /> {room.size}
                  </li>
                  <li>
                    <img src={bed} alt="" aria-hidden="true" /> {room.beds}
                  </li>
                  <li>
                    <img src={bath} alt="" aria-hidden="true" /> {room.bath}
                  </li>
                </ul>
                <p>
                  <span>{room.price}</span>/Night
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredRooms.length === 0 ? (
          <div className="rooms__empty">
            <h2>No rooms found</h2>
            <p>Try different dates or reduce the number of guests.</p>
          </div>
        ) : null}

        {hasDateFilter || hasGuestFilter ? (
          <div className="rooms__footer">
            <button
              className="rooms__clear"
              type="button"
              onClick={() => setSearchParams({})}
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
export default Rooms;
