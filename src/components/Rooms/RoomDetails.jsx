import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./RoomDetails.css";
import toast from "react-hot-toast";
import { fetchRoomById } from "../../lib/roomsApi.js";
import { useAuth } from "../../auth/AuthContext";
import { createBookingRequest } from "../../lib/bookingsApi.js";
import Skeleton from "../Skeleton/Skeleton.jsx";
import { useRoomDetails } from "../../hooks/rooms.js";

const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const addDaysISO = (isoDate, days) => {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const formatMoney = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
};

const RoomDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const backToRooms = location.search ? `/rooms${location.search}` : "/rooms";

  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [broken, setBroken] = useState({});
  const [bookingDraft, setBookingDraft] = useState(() => {
    const sp = new URLSearchParams(location.search);
    const base = todayISO();
    const requestedCheckIn = sp.get("checkIn") || addDaysISO(base, 1);
    const checkIn = requestedCheckIn < base ? base : requestedCheckIn;

    const requestedCheckOut = sp.get("checkOut") || addDaysISO(base, 2);
    const minCheckOut = addDaysISO(checkIn, 1);
    const checkOut = requestedCheckOut <= checkIn ? minCheckOut : requestedCheckOut;

    return {
      checkIn,
      checkOut,
      guests: sp.get("guests") || "2",
    };
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingSending, setBookingSending] = useState(false);

  useRoomDetails(id, setLoading, setRoom, fetchRoomById, toast);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const base = todayISO();
    const requestedCheckIn = sp.get("checkIn") || addDaysISO(base, 1);
    const checkIn = requestedCheckIn < base ? base : requestedCheckIn;

    const requestedCheckOut = sp.get("checkOut") || addDaysISO(base, 2);
    const minCheckOut = addDaysISO(checkIn, 1);
    const checkOut = requestedCheckOut <= checkIn ? minCheckOut : requestedCheckOut;

    setBookingDraft({
      checkIn,
      checkOut,
      guests: sp.get("guests") || "2",
    });
  }, [location.search]);

  const minCheckIn = todayISO();
  const minCheckOut = addDaysISO(bookingDraft.checkIn < minCheckIn ? minCheckIn : bookingDraft.checkIn, 1);

  const updateParams = (nextDraft) => {
    const next = new URLSearchParams(location.search);
    next.set("checkIn", nextDraft.checkIn);
    next.set("checkOut", nextDraft.checkOut);
    next.set("guests", nextDraft.guests);
    navigate(`${location.pathname}?${next.toString()}`, { replace: true });
  };

  const onCheckInChange = (value) => {
    const nextCheckIn = value && value < minCheckIn ? minCheckIn : value;
    const nextCheckOut = !bookingDraft.checkOut || bookingDraft.checkOut <= nextCheckIn ? addDaysISO(nextCheckIn, 1) : bookingDraft.checkOut;

    const nextDraft = {
      ...bookingDraft,
      checkIn: nextCheckIn,
      checkOut: nextCheckOut,
    };
    setBookingDraft(nextDraft);
    updateParams(nextDraft);
  };

  const onCheckOutChange = (value) => {
    const nextCheckOut = value && value <= bookingDraft.checkIn ? addDaysISO(bookingDraft.checkIn, 1) : value;
    const nextDraft = { ...bookingDraft, checkOut: nextCheckOut };
    setBookingDraft(nextDraft);
    updateParams(nextDraft);
  };

  const onGuestsChange = (value) => {
    const nextDraft = { ...bookingDraft, guests: String(value || "2") };
    setBookingDraft(nextDraft);
    updateParams(nextDraft);
  };

  const gallery = useMemo(() => {
    const imgs = Array.isArray(room?.images) ? room.images.filter(Boolean) : [];
    return imgs;
  }, [room]);

  const videos = useMemo(() => {
    const v = Array.isArray(room?.videos) ? room.videos.filter(Boolean) : [];
    return v;
  }, [room]);

  const media = useMemo(() => {
    const items = [];
    for (const src of gallery) items.push({ kind: "image", src });
    for (const src of videos) items.push({ kind: "video", src });
    return items;
  }, [gallery, videos]);

  useEffect(() => {
    setActiveIndex(0);
    setBroken({});
  }, [id, media.length]);

  const activeItem = media[activeIndex] || null;
  const activeSrc = activeItem?.src || "";
  const activeOk = Boolean(activeSrc) && !broken[activeSrc];

  const hasAnyOkImage = useMemo(() => {
    return media.some((it) => it?.src && !broken[it.src]);
  }, [media, broken]);

  useEffect(() => {
    if (!media.length) return;
    if (activeOk) return;

    const next = media.findIndex((it) => it?.src && !broken[it.src]);
    if (next >= 0 && next !== activeIndex) setActiveIndex(next);
  }, [media, broken, activeOk, activeIndex]);

  useEffect(() => {
    return () => {
      Fancybox.close();
    };
  }, []);

  const openGallery = useCallback(() => {
    // Only images open in Fancybox; videos stay in the active container.
    if (!gallery.length) return;
    if (activeItem?.kind !== "image") return;

    const slides = gallery.map((src) => ({
      src,
      type: "image",
      caption: room?.name || "",
    }));

    const startIndex = Math.max(0, gallery.indexOf(activeSrc));

    Fancybox.show(slides, {
      startIndex,
      animated: true,
      dragToClose: true,
      hideScrollbar: true,
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["close"],
        },
      },
    });
  }, [gallery, activeItem?.kind, activeSrc, room?.name]);

  if (loading) {
    return (
      <section className="room-details">
        <div className="room-details-container content" ref={rootRef}>
          <div className="room-details__media" aria-hidden="true">
            <div className="room-details__stage">
              <Skeleton style={{ width: "100%", height: 360, borderRadius: 18 }} />
            </div>
            <div className="room-details__thumbs">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} style={{ width: "100%", height: 72, borderRadius: 14 }} />
              ))}
            </div>
          </div>

          <div className="room-details__info" aria-hidden="true">
            <Skeleton style={{ width: "42%", height: 16, borderRadius: 10 }} />
            <Skeleton style={{ width: "72%", height: 30, borderRadius: 12, marginTop: 10 }} />
            <Skeleton style={{ width: "100%", height: 56, borderRadius: 12, marginTop: 12 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 14 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} style={{ width: "100%", height: 34, borderRadius: 12 }} />
              ))}
            </div>
            <Skeleton style={{ width: "46%", height: 22, borderRadius: 12, marginTop: 16 }} />
            <Skeleton style={{ width: "100%", height: 168, borderRadius: 16, marginTop: 16 }} />
          </div>
        </div>
      </section>
    );
  }

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
      <div
        className={`room-details-container content${hasAnyOkImage ? "" : " room-details-container--no-media"}`}
        ref={rootRef}
      >
        {hasAnyOkImage ? (
          <div className="room-details__media">
            {activeOk ? (
              <div className="room-details__stage" aria-label="Room media">
                <button
                  className="room-details__image-link"
                  type="button"
                  onClick={activeItem?.kind === "image" ? openGallery : undefined}
                  aria-label={activeItem?.kind === "image" ? "Open image viewer" : "Room video"}
                >
                  {activeItem?.kind === "video" ? (
                    <video
                      className="room-details__active-video"
                      src={activeSrc}
                      controls
                      preload="metadata"
                      muted
                      onError={() => setBroken((m) => ({ ...m, [activeSrc]: true }))}
                    />
                  ) : (
                    <img
                      src={activeSrc}
                      alt={room.name}
                      className="room-details__active-image"
                      onError={() => setBroken((m) => ({ ...m, [activeSrc]: true }))}
                    />
                  )}
                </button>
              </div>
            ) : null}

            {media.length > 1 ? (
              <div className="room-details__thumbs" aria-label="Room media">
                {media.slice(0, 8).map((it, i) => {
                  const src = it?.src || "";
                  const isBroken = !src || broken[src];
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={`${it.kind}-${src}-${i}`}
                      type="button"
                      className={`room-details__thumb${isActive ? " room-details__thumb--active" : ""}${isBroken ? " room-details__thumb--broken" : ""
                        }`}
                      onClick={() => {
                        if (!isBroken) setActiveIndex(i);
                      }}
                      aria-label={`Open ${it.kind} ${i + 1}`}
                      disabled={isBroken}
                    >
                      {it.kind === "video" ? (
                        <>
                          <video
                            className="room-details__thumb-video"
                            src={src}
                            muted
                            playsInline
                            preload="metadata"
                            onError={() => setBroken((m) => ({ ...m, [src]: true }))}
                          />
                          <span className="room-details__thumb-play" aria-hidden="true">
                            Play
                          </span>
                        </>
                      ) : (
                        <img
                          src={src}
                          alt=""
                          aria-hidden="true"
                          onError={() => setBroken((m) => ({ ...m, [src]: true }))}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="room-details__info">
          <p className="room-details__badge">
            {room.type}
            {room.room_number ? ` · #${room.room_number}` : ""}
          </p>
          <h1>{room.name}</h1>
          <p>{room.description || "A comfortable room with practical amenities for short or extended stays."}</p>

          <ul>
            <li>{room.size_sqm != null ? `${room.size_sqm} sqm` : "Size: -"}</li>
            <li>{room.beds != null ? `${room.beds} bed(s)` : "Beds: -"}</li>
            <li>{room.bathrooms != null ? `${room.bathrooms} bathroom(s)` : "Bathrooms: -"}</li>
            <li>{room.capacity != null ? `Capacity: ${room.capacity}` : "Capacity: -"}</li>
          </ul>

          <p className="room-details__price">
            {formatMoney(room.base_price_per_night, room.currency || "USD")} <span>/ night</span>
          </p>

          <div className="room-details__booking">
            <div className="room-details__booking-fields" aria-label="Booking details">
              <label className="room-details__field">
                <span>Check-in</span>
                <input
                  type="date"
                  value={bookingDraft.checkIn}
                  min={minCheckIn}
                  onChange={(e) => onCheckInChange(e.target.value)}
                />
              </label>

              <label className="room-details__field">
                <span>Check-out</span>
                <input
                  type="date"
                  value={bookingDraft.checkOut}
                  min={minCheckOut}
                  onChange={(e) => onCheckOutChange(e.target.value)}
                />
              </label>

              <label className="room-details__field">
                <span>Guests</span>
                <select value={bookingDraft.guests} onChange={(e) => onGuestsChange(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </label>
            </div>

            <label className="room-details__requests">
              <span>Special requests (optional)</span>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Anything we should know? (Late arrival, extra pillow, etc.)"
                rows={3}
              />
            </label>
          </div>

          <div className="room-details__actions">
            <button
              type="button"
              className="room-details__button"
              disabled={bookingSending}
              onClick={async () => {
                try {
                  if (!user) {
                    const next = location.pathname + location.search + location.hash;
                    navigate(`/login?next=${encodeURIComponent(next)}`);
                    return;
                  }

                  if (!bookingDraft.checkIn || !bookingDraft.checkOut) {
                    toast.error("Select dates first.");
                    return;
                  }

                  setBookingSending(true);
                  const res = await createBookingRequest({
                    room,
                    user,
                    checkIn: bookingDraft.checkIn,
                    checkOut: bookingDraft.checkOut,
                    guests: bookingDraft.guests,
                    specialRequests,
                  });
                  toast.success("Booking request sent.");
                  navigate(`/booking/confirmation/${encodeURIComponent(res.id)}`);
                } catch (e) {
                  toast.error(e?.message || "Failed to create booking.");
                } finally {
                  setBookingSending(false);
                }
              }}
            >
              {bookingSending ? "Sending..." : "Request booking"}
            </button>
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
