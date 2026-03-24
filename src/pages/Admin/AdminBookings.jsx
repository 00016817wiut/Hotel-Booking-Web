import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';


const STATUSES = ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"]


const AdminBookings = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Bookings").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setRows(Array.isArray(data) ? data : [])
    }
    catch (e) {
      toast.error(e?.message || "Failed to load bookings");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load();
  }, [])

  const setStatus = async (id, status) => {
    try {
      const {error} = await supabase.from("Bookings").update({status}).eq("id", id);
      if (error) throw error;
      toast.success("Status updated.");
      setRows((prev) => prev.map((r) => (r.id === id ? {...r, status} : r)))
    } catch (e) {
      toast.error(e?.message || "Failed to update status")
    }
  }

  return (
    <div>
      <h1 style={{ margin: 0, color: "var(--color-primary-strong)" }}>Bookings</h1>
      <p style={{ marginTop: 8, color: "var(--color-text-muted)" }}>Manage all booking requests and stays.</p>

      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      ) : rows.length ? (
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {rows.map((b) => (
            <article
              key={b.id}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: 14,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontWeight: 800, color: "var(--color-primary-strong)" }}>
                  {b.room_type || b.room_id || "Booking"}{" "}
                  <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>· #{b.id}</span>
                </div>

                <select
                  value={b.status || "pending"}
                  onChange={(e) => setStatus(b.id, e.target.value)}
                  style={{ minHeight: 38, border: "1px solid var(--color-border)", borderRadius: 10, padding: "6px 10px" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 10, display: "grid", gap: 6, color: "var(--color-text-muted)" }}>
                <div>Auth user: {b.auth_id || "-"}</div>
                <div>Dates: {b.check_in || "-"} → {b.check_out || "-"}</div>
                <div>Guests: {b.guests ?? "-"}</div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--color-text-muted)", marginTop: 14 }}>No bookings found.</p>
      )}
    </div>
  )
}

export default AdminBookings
