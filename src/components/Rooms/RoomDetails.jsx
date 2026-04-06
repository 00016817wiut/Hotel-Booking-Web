import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import "./RoomDetails.css";
import toast from "react-hot-toast";
import { fetchRoomById } from "../../lib/roomsApi.js";

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
  const rootRef = useRef(null);
  const backToRooms = location.search ? `/rooms${location.search}` : "/rooms";

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [broken, setBroken] = useState({});

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const r = await fetchRoomById(id);
        if (!alive) return;
        setRoom(r);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load room.");
        setRoom(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [id]);

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
      <section className="room-details room-details--missing content">
        <h1>Loading…</h1>
        <p>Fetching room details.</p>
        <Link to={backToRooms} className="room-details__button">
          Back to rooms
        </Link>
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
                      className={`room-details__thumb${isActive ? " room-details__thumb--active" : ""}${
                        isBroken ? " room-details__thumb--broken" : ""
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
