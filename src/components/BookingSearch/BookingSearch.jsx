import { useEffect, useMemo, useRef, useState } from "react";
import "./BookingSearch.css";

const MenuSelect = ({ value, onChange, options, placeholder = "Select" }) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const label = selected?.label ?? placeholder;

  const recalcPlacement = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const below = Math.max(0, window.innerHeight - rect.bottom);
    const above = Math.max(0, rect.top);

    const menuHeight = 260;
    const nextOpenUp = below < menuHeight && above > below;
    setOpenUp(nextOpenUp);
  };

  useEffect(() => {
    if (!open) return;

    recalcPlacement();

    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onResize = () => recalcPlacement();
    const onScroll = () => recalcPlacement();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <div className="menu-select" ref={rootRef}>
      <button
        type="button"
        className="menu-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          const el = rootRef.current;
          if (!open && el) {
            const rect = el.getBoundingClientRect();
            const below = Math.max(0, window.innerHeight - rect.bottom);
            const above = Math.max(0, rect.top);
            const menuHeight = 260;
            setOpenUp(below < menuHeight && above > below);
          }
          setOpen((v) => !v);
        }}
      >
        <span className="menu-select__value" title={label}>
          {label}
        </span>
        <span className="menu-select__chev" aria-hidden="true" />
      </button>

      {open ? (
        <div className={`menu-select__menu${openUp ? " menu-select__menu--up" : ""}`} role="listbox">
          {options.map((o) => {
            const active = String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`menu-select__option${active ? " menu-select__option--active" : ""}`}
                onClick={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

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

const BookingSearch = ({
  variant = "hero",
  defaultValues,
  onSubmit,
  title = "Search availability",
  showRoomType = false,
  roomTypes,
  rooms,
}) => {
  const defaults = useMemo(() => {
    const base = todayISO();
    const requestedCheckIn = defaultValues?.checkIn || addDaysISO(base, 1);
    const checkIn = requestedCheckIn < base ? base : requestedCheckIn;

    const requestedCheckOut = defaultValues?.checkOut || addDaysISO(base, 2);
    const minCheckOut = addDaysISO(checkIn, 1);
    const checkOut = requestedCheckOut <= checkIn ? minCheckOut : requestedCheckOut;

    const merged = {
      guests: "2",
      roomType: "any",
      ...defaultValues,
    };

    return {
      ...merged,
      checkIn,
      checkOut,
    };
  }, [defaultValues]);

  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState(String(defaults.guests ?? "2"));
  const [roomType, setRoomType] = useState(String(defaults.roomType ?? "any"));
  const [error, setError] = useState("");

  useEffect(() => {
    setCheckIn(defaults.checkIn);
    setCheckOut(defaults.checkOut);
    setGuests(String(defaults.guests ?? "2"));
    setRoomType(String(defaults.roomType ?? "any"));
    setError("");
  }, [defaults.checkIn, defaults.checkOut, defaults.guests, defaults.roomType]);

  const minCheckIn = todayISO();
  const minCheckOut = addDaysISO(checkIn < minCheckIn ? minCheckIn : checkIn, 1);

  const onCheckInChange = (value) => {
    const next = value && value < minCheckIn ? minCheckIn : value;
    setCheckIn(next);

    if (!checkOut || checkOut <= next) {
      setCheckOut(addDaysISO(next, 1));
    }
  };

  const onCheckOutChange = (value) => {
    const next = value && value <= checkIn ? addDaysISO(checkIn, 1) : value;
    setCheckOut(next);
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    if (!(start instanceof Date) || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Invalid dates.");
      return;
    }
    if (end <= start) {
      setError("Check-out must be after check-in.");
      return;
    }

    const g = Number(guests);
    if (!Number.isFinite(g) || g < 1) {
      setError("Guests must be 1 or more.");
      return;
    }

    onSubmit?.({
      checkIn,
      checkOut,
      guests: String(g),
      ...(showRoomType ? { roomType } : {}),
    });
  };

  const types = useMemo(() => (Array.isArray(roomTypes) && roomTypes.length ? roomTypes : []), [roomTypes]);
  const roomTypeOptions = useMemo(() => [{ value: "any", label: "Any" }, ...types.map((t) => ({ value: t, label: t }))], [types]);
  const guestOptions = useMemo(
    () => [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
    ],
    []
  );

  return (
    <form className={`booking-search booking-search--${variant}`} onSubmit={submit}>
      {variant === "bar" ? (
        <>
          <div className={`booking-search__bar ${rooms}`}>
            <label className="booking-search__field">
              <span>Check-in</span>
              <input value={checkIn} min={minCheckIn} onChange={(e) => onCheckInChange(e.target.value)} type="date" />
            </label>
            <label className="booking-search__field">
              <span>Check-out</span>
              <input value={checkOut} min={minCheckOut} onChange={(e) => onCheckOutChange(e.target.value)} type="date" />
            </label>
            <div className="booking-search__field">
              <span>Guests</span>
              <MenuSelect value={guests} onChange={(v) => setGuests(String(v))} options={guestOptions} />
            </div>

            {showRoomType ? (
              <div className="booking-search__field">
                <span>Room type</span>
                <MenuSelect value={roomType} onChange={(v) => setRoomType(String(v))} options={roomTypeOptions} />
              </div>
            ) : null}

            <button className="booking-search__submit" type="submit">
              Check availability
            </button>
          </div>
          {error ? <p className="booking-search__error">{error}</p> : null}
        </>
      ) : (
        <>
          <div className="booking-search__title">{title}</div>

          <div className={`booking-search__fields ${showRoomType ? "booking-search__fields--4" : ""}`.trim()}>
            <label className="booking-search__field">
              <span>Check-in</span>
              <input value={checkIn} min={minCheckIn} onChange={(e) => onCheckInChange(e.target.value)} type="date" />
            </label>
            <label className="booking-search__field">
              <span>Check-out</span>
              <input value={checkOut} min={minCheckOut} onChange={(e) => onCheckOutChange(e.target.value)} type="date" />
            </label>
            <div className="booking-search__field">
              <span>Guests</span>
              <MenuSelect value={guests} onChange={(v) => setGuests(String(v))} options={guestOptions} />
            </div>
            {showRoomType ? (
              <div className="booking-search__field">
                <span>Room type</span>
                <MenuSelect value={roomType} onChange={(v) => setRoomType(String(v))} options={roomTypeOptions} />
              </div>
            ) : null}
          </div>

          <div className="booking-search__actions">
            <button type="submit">Search</button>
            {error ? <p className="booking-search__error">{error}</p> : null}
          </div>
        </>
      )}
    </form>
  );
};

export default BookingSearch;
