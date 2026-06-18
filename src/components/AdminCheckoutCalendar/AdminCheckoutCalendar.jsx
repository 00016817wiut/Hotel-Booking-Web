import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import Skeleton from "../Skeleton/Skeleton.jsx";
import Tooltip from "../Tooltip/Tooltip.jsx";
import "./AdminCheckoutCalendar.css";

const pad2 = (n) => String(n).padStart(2, "0");

const toISODate = (d) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};

const startOfMonth = (year, monthIndex) => new Date(year, monthIndex, 1);
const endOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0);

const monthLabel = (year, monthIndex) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, monthIndex, 1));

const displayName = (b) => {
  const first = String(b.customer_first_name || "").trim();
  const last = String(b.customer_last_name || "").trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (b.customer_email) return String(b.customer_email);
  return "Guest";
};

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AdminCheckoutCalendar = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const from = toISODate(startOfMonth(year, month));
        const to = toISODate(endOfMonth(year, month));

        const { data, error } = await supabase
          .from("Bookings")
          .select("id,check_out,room_id,status,customer_first_name,customer_last_name,customer_email")
          .in("status", ["confirmed", "checked_in"])
          .gte("check_out", from)
          .lte("check_out", to)
          .order("check_out", { ascending: true });

        if (error) throw error;
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load checkout calendar.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [year, month]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const b of items) {
      const key = String(b.check_out || "");
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(b);
    }
    return map;
  }, [items]);

  const grid = useMemo(() => {
    const first = startOfMonth(year, month);
    // JS: 0=Sun..6=Sat; we want Monday-first.
    const firstDow = (first.getDay() + 6) % 7; // 0=Mon..6=Sun
    const daysInMonth = endOfMonth(year, month).getDate();

    const cells = [];
    for (let i = 0; i < firstDow; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [year, month]);

  const selectedItems = useMemo(() => {
    if (!selectedDay) return [];
    return grouped.get(selectedDay) || [];
  }, [grouped, selectedDay]);

  const goPrev = () => {
    setSelectedDay(null);
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNext = () => {
    setSelectedDay(null);
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  return (
    <div className="checkout-cal" aria-label="Checkout calendar">
      <div className="checkout-cal__head">
        <div className="checkout-cal__title">Upcoming check-outs</div>
        <div className="checkout-cal__nav">
          <button type="button" className="checkout-cal__navbtn" onClick={goPrev} aria-label="Previous month">
            Prev
          </button>
          <div className="checkout-cal__month">{monthLabel(year, month)}</div>
          <button type="button" className="checkout-cal__navbtn" onClick={goNext} aria-label="Next month">
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <>
          <div className="checkout-cal__grid" role="grid" aria-hidden="true">
            {weekdayNames.map((w) => (
              <div key={w} className="checkout-cal__dow" role="columnheader">
                {w}
              </div>
            ))}

            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="checkout-cal__cell">
                <Skeleton style={{ width: 24, height: 14, borderRadius: 8 }} />
              </div>
            ))}
          </div>

          <div className="checkout-cal__list" aria-hidden="true">
            <Skeleton style={{ height: 14, width: "42%" }} />
            <div className="checkout-cal__rows" style={{ marginTop: 10 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="checkout-cal__row">
                  <Skeleton style={{ height: 14, width: "58%" }} />
                  <Skeleton style={{ height: 12, width: "46%", marginTop: 8 }} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="checkout-cal__grid" role="grid">
          {weekdayNames.map((w) => (
            <div key={w} className="checkout-cal__dow" role="columnheader">
              {w}
            </div>
          ))}

          {grid.map((d, idx) => {
            if (!d) return <div key={`empty-${idx}`} className="checkout-cal__cell checkout-cal__cell--empty" />;
            const iso = toISODate(d);
            const list = grouped.get(iso) || [];
            const count = list.length;
            const isSelected = selectedDay === iso;
            const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const tooltipText = (() => {
              if (!count) return "";
              const lines = list.slice(0, 4).map((b) => `${displayName(b)} (Room #${b.room_id})`);
              if (list.length > 4) lines.push(`+${list.length - 4} more`);
              return lines.join("\n");
            })();

            return (
              <button
                key={iso}
                type="button"
                className={`checkout-cal__cell${count ? " checkout-cal__cell--has" : ""}${isSelected ? " checkout-cal__cell--selected" : ""}${
                  isPast ? " checkout-cal__cell--past" : ""
                }`}
                onClick={() => setSelectedDay((prev) => (prev === iso ? null : iso))}
              >
                <span className="checkout-cal__daynum">{d.getDate()}</span>
                {count ? (
                  <Tooltip text={tooltipText}>
                    <span className="checkout-cal__badge">{count}</span>
                  </Tooltip>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {selectedDay ? (
        <div className="checkout-cal__list" aria-label="Check-out list">
          <div className="checkout-cal__list-title">Check-outs on {selectedDay}</div>
          {selectedItems.length ? (
            <div className="checkout-cal__rows">
              {selectedItems.map((b) => (
                <div key={b.id} className="checkout-cal__row">
                  <div className="checkout-cal__who">{displayName(b)}</div>
                  <div className="checkout-cal__meta">
                    Room #{b.room_id} · {b.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="checkout-cal__empty">No check-outs.</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AdminCheckoutCalendar;
