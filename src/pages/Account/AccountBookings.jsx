import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import "./AccountPages.css";

const STATUSES = ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"];

const AccountBookings = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.profile?.role || "").toLowerCase() === "admin";

  const [myRows, setMyRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const { data, error } = await supabase
            .from("Bookings")
            .select("*")
            .order("created_at", { ascending: false });
          if (error) throw error;
          if (alive) setAllRows(Array.isArray(data) ? data : []);
        }

        const { data: myData, error: myError } = await supabase
          .from("Bookings")
          .select("*")
          .eq("auth_id", user.id)
          .order("check_in", { ascending: false });
        if (myError) throw myError;
        if (alive) setMyRows(Array.isArray(myData) ? myData : []);
      } catch (e) {
        if (alive) toast.error(e?.message || "Failed to load bookings");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [user.id, isAdmin]);

  const setStatus = async (id, status) => {
    try {
      const { error } = await supabase.from("Bookings").update({ status }).eq("id", id);
      if (error) throw error;
      toast.success("Status updated.");
      const apply = (row) => row.id === id ? { ...row, status } : row;
      setAllRows((prev) => prev.map(apply));
      setMyRows((prev) => prev.map(apply));
    } catch (e) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>My bookings</h1>
        <p>Your booking requests and confirmed stays.</p>
      </header>

      {isAdmin && allRows.length > 0 && (
        <section className="account-page__section">
          <h2 className="account-page__section-title">All bookings</h2>
          <div className="booking-list">
            {allRows.map((b) => (
              <article className="booking-item" key={b.id}>
                <div className="booking-item__top">
                  <div className="booking-item__title">{b.room_type || b.room_id || "Booking"} #{b.id}</div>
                  <select
                    className={`booking-item__status booking-item__status--${String(b.status || "unknown").toLowerCase()}`}
                    value={b.status || "pending"}
                    onChange={(e) => setStatus(b.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="booking-item__meta">
                  <div>User: {b.auth_id || "-"}</div>
                  <div>Check-in: {b.check_in || "-"} → Check-out: {b.check_out || "-"}</div>
                  <div>Guests: {b.guests ?? "-"}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="account-page__section">
        {loading ? (
          <p className="account-page__muted">Loading…</p>
        ) : myRows.length ? (
          <div className="booking-list">
            {myRows.map((b) => (
              <article className="booking-item" key={b.id}>
                <div className="booking-item__top">
                  <div className="booking-item__title">{b.room_type || b.room_id || "Booking"}</div>
                  <div className={`booking-item__status booking-item__status--${String(b.status || "unknown").toLowerCase()}`}>
                    {b.status || "unknown"}
                  </div>
                </div>
                <div className="booking-item__meta">
                  <div>Check-in: {b.check_in || "-"} → Check-out: {b.check_out || "-"}</div>
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
      </section>
    </div>
  );
};

export default AccountBookings;
