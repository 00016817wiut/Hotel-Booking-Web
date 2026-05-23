import "./Rooms.css";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BookingSearch from "../BookingSearch/BookingSearch.jsx";
import toast from "react-hot-toast";
import { fetchActiveRooms, fetchAvailableRooms } from "../../lib/roomsApi.js";
import Skeleton from "../Skeleton/Skeleton.jsx";
import { useAvailableRooms, useRooms } from "../../hooks/rooms.js";
import { formatMoney, pickType } from "../../utils/helpers/rooms.js";

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allRooms, setAllRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guestsParam = searchParams.get("guests") || "";
  const roomTypeParam = searchParams.get("roomType") || "any";
  const guests = guestsParam ? Number(guestsParam) : 0;
  const hasDateFilter = Boolean(checkIn && checkOut);
  const hasGuestFilter = Number.isFinite(guests) && guests > 0;
  const showRoomsList = roomTypeParam !== "any" || hasDateFilter || hasGuestFilter;

  useRooms(setRoomsLoading, setAllRooms, fetchActiveRooms, toast);
  useAvailableRooms(hasDateFilter, setAvailabilityLoading, setAvailableRooms, fetchAvailableRooms, toast, hasGuestFilter, guests, checkIn, checkOut);


  const roomTypes = useMemo(
    () => Array.from(new Set(allRooms.map((r) => r.type).filter(Boolean))).sort(),
    [allRooms]
  );
  const roomsBase = availableRooms ?? allRooms;

  const typeCards = useMemo(() => {
    return roomTypes.map((type) => {
      const roomsOfType = allRooms.filter((r) => r.type === type);

      const availableOfType = roomsBase.filter((r) => {
        if (String(r.type || "") !== String(type || "")) return false;
        if (hasGuestFilter && (r.capacity ?? 0) < guests) return false;
        return true;
      });

      const prices = roomsOfType
        .map((r) => Number(r.base_price_per_night))
        .filter((n) => Number.isFinite(n));
      const fromPrice = prices.length ? Math.min(...prices) : null;
      const maxCapacity = Math.max(
        ...roomsOfType
          .map((r) => Number(r.capacity))
          .filter((n) => Number.isFinite(n))
      );

      return {
        type,
        total: roomsOfType.length,
        available: availableOfType.length,
        fromPrice,
        maxCapacity: Number.isFinite(maxCapacity) ? maxCapacity : null,
      };
    });
  }, [roomTypes, allRooms, roomsBase, hasGuestFilter, guests]);

  const filteredRooms = useMemo(() => {
    return roomsBase.filter((room) => {
      if (roomTypeParam !== "any" && String(room.type || "").toLowerCase() !== roomTypeParam.toLowerCase()) return false;
      if (hasGuestFilter && (room.capacity ?? 0) < guests) return false;
      return true;
    });
  }, [roomsBase, roomTypeParam, hasGuestFilter, guests]);

  const isSingleResult = filteredRooms.length === 1;

  const roomTypeLabel =
    roomTypeParam === "any"
      ? "All room types"
      : roomTypes.find((t) => String(t).toLowerCase() === roomTypeParam.toLowerCase()) || roomTypeParam;

  const onSearch = ({ checkIn: ci, checkOut: co, guests: g }) => {
    const next = { checkIn: ci, checkOut: co, guests: g };
    // Room type is controlled by the sidebar; preserve it across searches.
    if (roomTypeParam && roomTypeParam !== "any") next.roomType = roomTypeParam;
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

        <div className="rooms__search rooms__search--top" aria-label="Date and guest filters">
          <BookingSearch
            variant="bar"
            defaultValues={{
              ...(checkIn ? { checkIn } : {}),
              ...(checkOut ? { checkOut } : {}),
              guests: guestsParam || "2",
            }}
            onSubmit={onSearch}
            rooms="rooms__search-form"
          />
        </div>

        <div className="rooms__layout">
          <aside className="rooms__sidebar" aria-label="Room type filters">
            <div className="rooms__sidebar-title">Room types</div>
            <div className="rooms__sidebar-list">
              {roomsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="room-type-pill room-type-pill--sidebar room-type-pill--skel" aria-hidden="true">
                    <Skeleton className="room-type-pill__skel-line" style={{ height: 14, width: `${70 + i * 3}%` }} />
                    <Skeleton className="room-type-pill__skel-line" style={{ height: 12, width: "55%", marginTop: 8 }} />
                  </div>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    className={`room-type-pill room-type-pill--sidebar${roomTypeParam === "any" ? " room-type-pill--active" : ""}`}
                    onClick={() => pickType("any")}
                  >
                    <span className="room-type-pill__name">All</span>
                    <span className="room-type-pill__meta">{allRooms.length} rooms</span>
                  </button>

                  {typeCards.map((card) => {
                    const isActive = String(roomTypeParam).toLowerCase() === String(card.type).toLowerCase();
                    return (
                      <button
                        type="button"
                        className={`room-type-pill room-type-pill--sidebar${isActive ? " room-type-pill--active" : ""}`}
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
                </>
              )}
            </div>
          </aside>

          <div className="rooms__main">
            {roomsLoading ? (
              <div className="rooms__list">
                <div className="rooms__list-header">
                  <Skeleton style={{ height: 18, width: "48%" }} />
                  <Skeleton style={{ height: 14, width: "36%", marginTop: 8 }} />
                </div>
                <div className="rooms__body">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className="rooms__body-item rooms__body-item--skel" key={i} aria-hidden="true">
                      <div className="room__image">
                        <Skeleton style={{ height: "100%", width: "100%", borderRadius: 0 }} />
                      </div>
                      <div className="room__info">
                        <Skeleton style={{ height: 18, width: "78%" }} />
                        <Skeleton style={{ height: 14, width: "62%", marginTop: 10 }} />
                        <Skeleton style={{ height: 16, width: "46%", marginTop: 14 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : showRoomsList ? (
              <div className="rooms__list">
                <div className="rooms__list-header">
                  <h2>{`Available rooms: ${roomTypeLabel}`}</h2>
                  <p>
                    {availabilityLoading || roomsLoading
                      ? "Loading…"
                      : `${filteredRooms.length} room(s) available for your selection.`}
                  </p>
                </div>

                <div className={`rooms__body${isSingleResult ? " rooms__body--single" : ""}`}>
                  {filteredRooms.map((room) => (
                    <Link to={`/room/${room.id}?${searchParams.toString()}`} className="rooms__body-item" key={room.id}>
                      <div className="room__image">
                        {Array.isArray(room.images) && room.images[0] ? (
                          <img
                            src={room.images[0]}
                            alt={`${room.type} ${room.room_number || ""}`.trim()}
                            loading="lazy"
                          />
                        ) : (
                          <div className="room__image-placeholder">No image</div>
                        )}
                      </div>

                      <div className="room__info">
                        <h1>
                          {room.type}
                          {room.room_number ? <span className="room__number"> · #{room.room_number}</span> : null}
                        </h1>
                        <p className="room__sub">
                          {room.beds != null ? `${room.beds} bed(s)` : "Beds: -"}
                          {room.size_sqm != null ? ` · ${room.size_sqm} sqm` : ""}
                        </p>
                        <p className="room__price">
                          <span>{formatMoney(room.base_price_per_night, room.currency || "USD")}</span> / night
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
                <p>Pick a type below or set dates and guests to see what is available.</p>
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
        </div>

      </div>
    </section>
  );
};

export default Rooms;
