import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../auth/AuthContext";
import "./BookingConfirmation.css";
import Skeleton from "../../components/Skeleton/Skeleton.jsx";

const formatMoney = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${Math.round(n)} ${currency}`;
  }
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Bookings")
          .select("id,status,check_in,check_out,guests,total_amount,currency,room_id,created_at")
          .eq("id", bookingId)
          .eq("auth_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!alive) return;

        setBooking(data || null);

        if (data?.room_id) {
          const { data: roomData, error: roomErr } = await supabase
            .from("Rooms")
            .select("name")
            .eq("id", data.room_id)
            .maybeSingle();

          if (!roomErr && alive) {
            setRoomName(roomData?.name || "");
          }
        }
      } catch {
        if (alive) setBooking(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (user?.id && bookingId) load();
    else setLoading(false);

    return () => {
      alive = false;
    };
  }, [bookingId, user?.id]);

  const bookingRef = useMemo(() => {
    if (!booking?.id) return "-";
    const raw = String(booking.id);
    return `ANR-${raw.padStart(6, "0")}`;
  }, [booking?.id]);

  if (loading) {
    return (
      <section className="booking-confirmation content">
        <div className="booking-confirmation__card">
          <Skeleton style={{ height: 14, width: "38%" }} />
          <Skeleton style={{ height: 28, width: "62%", marginTop: 10 }} />
          <Skeleton style={{ height: 14, width: "86%", marginTop: 12 }} />
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ border: "1px solid var(--color-border)", borderRadius: 12, padding: "12px 14px" }}>
                <Skeleton style={{ height: 12, width: "46%" }} />
                <Skeleton style={{ height: 14, width: "72%", marginTop: 8 }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="booking-confirmation content">
        <div className="booking-confirmation__card">
          <h1>Booking not found</h1>
          <p>This confirmation page is unavailable or you do not have access to this booking.</p>
          <div className="booking-confirmation__actions">
            <Link to="/account/bookings" className="booking-confirmation__btn booking-confirmation__btn--primary">
              Go to my bookings
            </Link>
            <Link to="/rooms" className="booking-confirmation__btn booking-confirmation__btn--ghost">
              Browse rooms
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking-confirmation content">
      <div className="booking-confirmation__card">
        <p className="booking-confirmation__status">Booking request submitted</p>
        <h1>Confirmation details</h1>
        <p className="booking-confirmation__lead">
          Thank you{user?.profile?.first_name ? `, ${user.profile.first_name}` : ""}. Your request is now <strong>{booking.status}</strong>.
        </p>

        <dl className="booking-confirmation__list">
          <div>
            <dt>Booking reference</dt>
            <dd>{bookingRef}</dd>
          </div>
          <div>
            <dt>Room</dt>
            <dd>{roomName || `Room #${booking.room_id}`}</dd>
          </div>
          <div>
            <dt>Check-in</dt>
            <dd>{formatDate(booking.check_in)}</dd>
          </div>
          <div>
            <dt>Check-out</dt>
            <dd>{formatDate(booking.check_out)}</dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>{booking.guests}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatMoney(booking.total_amount, booking.currency || "USD")}</dd>
          </div>
        </dl>

        <div className="booking-confirmation__actions">
          <Link to="/account/bookings" className="booking-confirmation__btn booking-confirmation__btn--primary">
            Open my bookings
          </Link>
          <Link to="/rooms" className="booking-confirmation__btn booking-confirmation__btn--ghost">
            Book another room
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookingConfirmation;
