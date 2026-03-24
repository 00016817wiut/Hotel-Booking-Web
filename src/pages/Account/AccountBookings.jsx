import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../auth/AuthContext";
import "./AccountPages.css"

const AccountBookings = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase.from("Bookings").select("*").eq("auth_id", user.id).order("check_in", { ascending: false });

        if (error) throw error;
        if (!alive) return;

        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        toast.error(err?.message || "Failed to load bookings.");
      } finally {
        if (alive) setLoading(false)
      }
    }
    load();

    return () => {
      alive = false;
    };
  }, [user?.id])

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>My bookings</h1>
        <p>Your booking requests and confirmed stays.</p>
      </header>

      <div className="account-page__card">
        {loading ? (
          <p className="account-page__muted">Loading…</p>
        ) : rows.length ? (
          <div className="booking-list">
            {rows.map((b) => (
              <article className="booking-item" key={b.id}>
                <div className="booking-item__top">
                  <div className="booking-item__title">{b.room_type || b.room_id || "Booking"}</div>
                  <div className={`booking-item__status booking-item__status--${String(b.status || "unknown").toLowerCase()}`}>
                    {b.status || "unknown"}
                  </div>
                </div>

                <div className="booking-item__meta">
                  <div>Check-in: {b.check_in || "-"}</div>
                  <div>Check-out: {b.check_out || "-"}</div>
                  <div>Guests: {b.guests ?? "-"}</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="account-empty">
            <h2>No bookings yet</h2>
            <p>When you request a booking, it will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountBookings