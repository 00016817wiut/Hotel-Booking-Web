import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { cacheGet, cacheSet } from "../../lib/cache";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import "./AccountPages.css";

const STATUSES = ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"];

const isoDateToUtcMs = (iso) => {
  if (!iso || typeof iso !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  const ms = Date.UTC(y, m - 1, d);
  return Number.isFinite(ms) ? ms : null;
};

const nightsBetween = (checkIn, checkOut) => {
  const a = isoDateToUtcMs(checkIn);
  const b = isoDateToUtcMs(checkOut);
  if (a == null || b == null) return 0;
  const days = Math.floor((b - a) / 86400000);
  return days > 0 ? days : 0;
};

const formatMoney = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString();
  }
};

const displayName = (b) => {
  const first = String(b.customer_first_name || "").trim();
  const last = String(b.customer_last_name || "").trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (b.customer_email) return String(b.customer_email);
  return "Guest";
};

const AccountBookings = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.profile?.role || "").toLowerCase() === "admin";

  const [myRows, setMyRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const myRowsRef = useRef([]);
  const allRowsRef = useRef([]);

  useEffect(() => {
    myRowsRef.current = myRows;
  }, [myRows]);

  useEffect(() => {
    allRowsRef.current = allRows;
  }, [allRows]);

  useEffect(() => {
    let alive = true;

    // Show cached rows immediately while fetching fresh
    const myKey = `cache:bookings:me:${user.id}:v1`;
    const adminKey = `cache:bookings:all:v1`;
    const cachedMine = cacheGet(myKey, { maxAgeMs: 5 * 60 * 1000, storage: sessionStorage });
    if (cachedMine && alive) setMyRows(cachedMine);

    const cachedAll = isAdmin ? cacheGet(adminKey, { maxAgeMs: 60 * 1000, storage: sessionStorage }) : null;
    if (isAdmin) {
      if (cachedAll && alive) setAllRows(cachedAll);
    }

    const hasCached = Boolean((cachedMine && cachedMine.length) || (isAdmin && cachedAll && cachedAll.length));
    if (hasCached) setLoading(false);

    const load = async () => {
      const hasAnyRows =
        (cachedMine && cachedMine.length) ||
        myRowsRef.current.length ||
        (isAdmin && ((cachedAll && cachedAll.length) || allRowsRef.current.length));
      if (hasAnyRows) setRefreshing(true);
      else setLoading(true);

      try {
        const adminPromise = isAdmin
          ? supabase
              .from("Bookings")
              .select(
                "id,status,auth_id,check_in,check_out,guests,total_amount,currency,customer_first_name,customer_last_name,customer_email,customer_phone,special_requests,created_at"
              )
              .order("created_at", { ascending: false })
              .limit(100)
          : Promise.resolve({ data: null, error: null });

        const minePromise = supabase
          .from("Bookings")
          .select("id,status,check_in,check_out,guests,total_amount,currency,special_requests,created_at")
          .eq("auth_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        const [adminRes, mineRes] = await Promise.all([adminPromise, minePromise]);

        if (adminRes?.error) throw adminRes.error;
        if (mineRes?.error) throw mineRes.error;

        if (isAdmin) {
          const rows = Array.isArray(adminRes.data) ? adminRes.data : [];
          if (alive) setAllRows(rows);
          cacheSet(adminKey, rows, { storage: sessionStorage });
        }

        const mine = Array.isArray(mineRes.data) ? mineRes.data : [];
        if (alive) setMyRows(mine);
        cacheSet(myKey, mine, { storage: sessionStorage });
      } catch (e) {
        if (alive) toast.error(e?.message || "Failed to load bookings");
      } finally {
        if (alive) {
          setLoading(false);
          setRefreshing(false);
        }
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

      const adminKey = `cache:bookings:all:v1`;
      const myKey = `cache:bookings:me:${user.id}:v1`;

      setAllRows((prev) => {
        const next = prev.map(apply);
        cacheSet(adminKey, next, { storage: sessionStorage });
        return next;
      });

      setMyRows((prev) => {
        const next = prev.map(apply);
        cacheSet(myKey, next, { storage: sessionStorage });
        return next;
      });
    } catch (e) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  const requestStatusChange = (booking, nextStatus) => {
    const prevStatus = String(booking?.status || "pending");
    const next = String(nextStatus || prevStatus);
    if (!booking?.id) return;

    if (String(prevStatus).toLowerCase() === "cancelled") {
      toast.error("Cancelled bookings cannot be updated. Delete it instead.");
      return;
    }

    if (prevStatus === next) return;

    setConfirm({
      kind: "status",
      bookingId: booking.id,
      nextStatus: next,
      title: "Change booking status",
      message: `Change status from "${prevStatus}" to "${next}"?`,
      confirmLabel: "Change",
      danger: next.toLowerCase() === "cancelled",
    });
  };

  const requestDeleteBooking = (booking) => {
    if (!booking?.id) return;
    setConfirm({
      kind: "delete",
      bookingId: booking.id,
      title: "Delete booking",
      message: "Delete this cancelled booking permanently? This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
  };

  const deleteBooking = async (id) => {
    const { error } = await supabase.from("Bookings").delete().eq("id", id);
    if (error) throw error;
  };

  const cancelMyBooking = async (booking) => {
    if (!booking?.id) return;
    const status = String(booking.status || "").toLowerCase();
    if (status !== "pending") {
      toast.error("Only pending bookings can be cancelled.");
      return;
    }

    setConfirm({
      kind: "cancel",
      bookingId: booking.id,
      title: "Cancel booking request",
      message: "Cancel this booking request?", 
      confirmLabel: "Cancel request",
      cancelLabel: "Keep it",
      danger: true,
    });
  };

  const runCancelMyBooking = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      const { error } = await supabase.from("Bookings").update({ status: "cancelled" }).eq("id", bookingId);
      if (error) throw error;

      toast.success("Booking cancelled.");
      const myKey = `cache:bookings:me:${user.id}:v1`;
      setMyRows((prev) => {
        const next = prev.map((r) => (r.id === bookingId ? { ...r, status: "cancelled" } : r));
        cacheSet(myKey, next, { storage: sessionStorage });
        return next;
      });
    } catch (e) {
      toast.error(e?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const onConfirm = async () => {
    if (!confirm) return;

    const { kind, bookingId, nextStatus } = confirm;
    setConfirm(null);

    try {
      if (kind === "status") {
        await setStatus(bookingId, nextStatus);
        return;
      }

      if (kind === "delete") {
        await deleteBooking(bookingId);
        toast.success("Booking deleted.");

        const adminKey = `cache:bookings:all:v1`;
        setAllRows((prev) => {
          const next = prev.filter((r) => r.id !== bookingId);
          cacheSet(adminKey, next, { storage: sessionStorage });
          return next;
        });
        return;
      }

      if (kind === "cancel") {
        await runCancelMyBooking(bookingId);
      }
    } catch (e) {
      toast.error(e?.message || "Action failed.");
    }
  };

  return (
    <div className="account-page">
      <ConfirmDialog
        key={confirm ? `${confirm.kind}:${confirm.bookingId}:${confirm.nextStatus || ""}` : "confirm"}
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        cancelLabel={confirm?.cancelLabel}
        danger={Boolean(confirm?.danger)}
        onConfirm={onConfirm}
        onClose={() => setConfirm(null)}
      />
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
                  <div className="booking-item__title">Booking #{b.id}</div>
                  {String(b.status || "").toLowerCase() === "cancelled" ? (
                    <div className="booking-item__admin-actions">
                      <div className={`booking-item__status booking-item__status--cancelled`}>cancelled</div>
                      <button
                        type="button"
                        className="booking-item__delete"
                        onClick={() => requestDeleteBooking(b)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <select
                      className={`booking-item__status booking-item__status--${String(b.status || "unknown").toLowerCase()}`}
                      value={b.status || "pending"}
                      onChange={(e) => requestStatusChange(b, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                  <div className="booking-item__meta">
                    <div>User: {displayName(b)}</div>
                    {b.created_at ? <div>Requested: {formatDateTime(b.created_at)}</div> : null}
                    <div>Check-in: {b.check_in || "-"} → Check-out: {b.check_out || "-"}</div>
                    <div>Guests: {b.guests ?? "-"}</div>
                    <div>
                      Nights: {nightsBetween(b.check_in, b.check_out) || "-"} · Total: {formatMoney(b.total_amount, b.currency || "USD")}
                    </div>
                    {b.special_requests ? (
                      <div>
                        Requests: <span className="booking-item__requests">{b.special_requests}</span>
                      </div>
                    ) : null}
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
                  <div className="booking-item__title">Booking #{b.id}</div>
                  <div className={`booking-item__status booking-item__status--${String(b.status || "unknown").toLowerCase()}`}>
                    {b.status || "unknown"}
                  </div>
                </div>
                <div className="booking-item__meta">
                  <div>Check-in: {b.check_in || "-"} → Check-out: {b.check_out || "-"}</div>
                  <div>Guests: {b.guests ?? "-"}</div>
                  <div>
                    Nights: {nightsBetween(b.check_in, b.check_out) || "-"} · Total: {formatMoney(b.total_amount, b.currency || "USD")}
                  </div>
                </div>

                {String(b.status || "").toLowerCase() === "pending" ? (
                  <div className="booking-item__actions">
                    <button
                      type="button"
                      className="booking-item__cancel"
                      onClick={() => cancelMyBooking(b)}
                      disabled={cancellingId === b.id}
                    >
                      {cancellingId === b.id ? "Cancelling..." : "Cancel request"}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="account-empty">
            <h2>No bookings yet</h2>
            <p>When you request a booking, it will appear here.</p>
          </div>
        )}

        {refreshing ? <p className="account-page__muted">Updating…</p> : null}
      </section>
    </div>
  );
};

export default AccountBookings;
