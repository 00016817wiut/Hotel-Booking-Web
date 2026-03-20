import { useEffect, useMemo, useState } from "react";
import "./BookingSearch.css";

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

  const types = Array.isArray(roomTypes) && roomTypes.length ? roomTypes : [];

  return (
    <form className={`booking-search booking-search--${variant}`} onSubmit={submit}>
      {variant === "bar" ? (
        <>
          <div className="booking-search__bar">
            <label className="booking-search__field">
              <span>Check-in</span>
              <input value={checkIn} min={minCheckIn} onChange={(e) => onCheckInChange(e.target.value)} type="date" />
            </label>
            <label className="booking-search__field">
              <span>Check-out</span>
              <input value={checkOut} min={minCheckOut} onChange={(e) => onCheckOutChange(e.target.value)} type="date" />
            </label>
            <label className="booking-search__field">
              <span>Guests</span>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>

            {showRoomType ? (
              <label className="booking-search__field">
                <span>Room type</span>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                  <option value="any">Any</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
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
            <label className="booking-search__field">
              <span>Guests</span>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            {showRoomType ? (
              <label className="booking-search__field">
                <span>Room type</span>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                  <option value="any">Any</option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
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
