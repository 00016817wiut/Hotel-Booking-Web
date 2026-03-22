import "./Rooms.css";
import { Link, useSearchParams } from "react-router-dom";
import roomsInfo from "./data/roomsInfo.js";
import BookingSearch from "../BookingSearch/BookingSearch.jsx";
import { isRoomAvailable } from "../../utils/availability.js";

const formatMoney = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
};

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "";
  const roomTypeParam = searchParams.get("roomType") || "any";
  const guests = guestsParam ? Number(guestsParam) : 0;

  const hasDateFilter = Boolean(checkIn && checkOut);
  const hasGuestFilter = Number.isFinite(guests) && guests > 0;

  const showRoomsList = roomTypeParam !== "any" || hasDateFilter || hasGuestFilter;

  const roomTypes = Array.from(new Set(roomsInfo.map((r) => r.type).filter(Boolean))).sort();

  const typeCards = roomTypes.map((type) => {
    const roomsOfType = roomsInfo.filter((r) => r.type === type);
    const availableRoomsOfType = roomsOfType.filter((r) => {
      if (hasGuestFilter && (r.capacity ?? 0) < guests) return false;
      if (hasDateFilter && !isRoomAvailable(r, checkIn, checkOut)) return false;
      return true;
    });

    const prices = roomsOfType.map((r) => Number(r.pricePerNight)).filter((n) => Number.isFinite(n));
    const fromPrice = prices.length ? Math.min(...prices) : null;
    const maxCapacity = Math.max(...roomsOfType.map((r) => Number(r.capacity)).filter((n) => Number.isFinite(n)));
    const cover = roomsOfType[0]?.image;

    return {
      type,
      total: roomsOfType.length,
      available: availableRoomsOfType.length,
      fromPrice,
      maxCapacity: Number.isFinite(maxCapacity) ? maxCapacity : null,
      cover,
    };
  });

  const filteredRooms = roomsInfo.filter((room) => {
    if (roomTypeParam !== "any" && String(room.type || "").toLowerCase() !== roomTypeParam.toLowerCase()) return false;
    if (hasGuestFilter && (room.capacity ?? 0) < guests) return false;
    if (hasDateFilter && !isRoomAvailable(room, checkIn, checkOut)) return false;
    return true;
  });

  const roomTypeLabel =
    roomTypeParam === "any"
      ? "All room types"
      : roomTypes.find((t) => String(t).toLowerCase() === roomTypeParam.toLowerCase()) || roomTypeParam;

  const onSearch = ({ checkIn: ci, checkOut: co, guests: g, roomType }) => {
    const next = { checkIn: ci, checkOut: co, guests: g };
    if (roomType && roomType !== "any") next.roomType = roomType;
    setSearchParams(next);
  };

  const pickType = (type) => {
    const next = {};
    if (checkIn) next.checkIn = checkIn;
    if (checkOut) next.checkOut = checkOut;
    if (guestsParam) next.guests = guestsParam;

    if (type && type !== "any") next.roomType = type;
    setSearchParams(next);
  };

  return (
    <section className="rooms" id="rooms">
      <div className="rooms__container content">
        <div className="rooms__header">
          <h1>Room Types</h1>
          <p>
            {hasDateFilter || hasGuestFilter
              ? "Select a room type. Availability updates based on your dates and guests."
              : "Choose a room type to see details and availability."}
          </p>
        </div>

        <div className="rooms__search">
          <BookingSearch
            variant="inline"
            title="Filter"
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

        <div className="room-types" aria-label="Room type selector">
          <button
            type="button"
            className={`room-type-pill${roomTypeParam === "any" ? " room-type-pill--active" : ""}`}
            onClick={() => pickType("any")}
          >
            <span className="room-type-pill__name">All</span>
            <span className="room-type-pill__meta">{roomsInfo.length} rooms</span>
          </button>

          {typeCards.map((card) => {
            const isActive = String(roomTypeParam).toLowerCase() === String(card.type).toLowerCase();
            return (
              <button
                type="button"
                className={`room-type-pill${isActive ? " room-type-pill--active" : ""}`}
                key={card.type}
                onClick={() => pickType(card.type)}
              >
                <span className="room-type-pill__name">{card.type}</span>
                <span className="room-type-pill__badge">
                  {card.available}/{card.total}
                </span>
                <span className="room-type-pill__meta">
                  {card.maxCapacity != null ? `Up to ${card.maxCapacity}` : ""}
                  {card.fromPrice != null ? ` · from ${formatMoney(card.fromPrice)}` : ""}
                </span>
              </button>
            );
          })}
        </div>

        {showRoomsList ? (
          <div className="rooms__list">
            <div className="rooms__list-header">
              <h2>{`Available rooms: ${roomTypeLabel}`}</h2>
              <p>{filteredRooms.length} room(s) available for your selection.</p>
            </div>

            <div className="rooms__body">
              {filteredRooms.map((room) => (
                <Link to={`/room/${room.id}?${searchParams.toString()}`} className="rooms__body-item" key={room.id}>
                  <div className="room__image">
                    <img src={room.image} alt={`${room.type} ${room.roomNumber || ""}`.trim()} />
                  </div>

                  <div className="room__info">
                    <h1>
                      {room.type}
                      {room.roomNumber ? <span className="room__number"> · #{room.roomNumber}</span> : null}
                    </h1>
                    <p className="room__sub">
                      {room.beds} · {room.size}
                    </p>
                    <p className="room__price">
                      <span>{formatMoney(room.pricePerNight)}</span> / night
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
          </div>
        ) : (
          <div className="rooms__hint">
            <h2>Choose a room type</h2>
            <p>Pick a type above or set dates and guests to see what is available.</p>
          </div>
        )}

        {hasDateFilter || hasGuestFilter || roomTypeParam !== "any" ? (
          <div className="rooms__footer">
            <button className="rooms__clear" type="button" onClick={() => setSearchParams({})}>
              Clear filters
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Rooms;
