import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminBookingNotifier.css";

const displayName = (b) => {
  const first = String(b?.customer_first_name || "").trim();
  const last = String(b?.customer_last_name || "").trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (b?.customer_email) return String(b.customer_email);
  return "Guest";
};

const unlockAudioContext = async (ctx) => {
  if (!ctx) return;
  if (ctx.state === "running") return;
  try {
    await ctx.resume();
  } catch {
    // ignore
  }
};

const playBeep = async (ctx) => {
  if (!ctx) return;
  await unlockAudioContext(ctx);
  if (ctx.state !== "running") return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
};

const AdminBookingNotifier = ({ enabled }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const seenRef = useRef(new Set());
  const baselineRef = useRef(null);

  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  const latest = useMemo(() => (items.length ? items[0] : null), [items]);
  const count = items.length;

  // Create audio context lazily and unlock on first user gesture.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    audioRef.current = ctx;

    const onGesture = () => unlockAudioContext(ctx);
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });

    return () => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
      audioRef.current = null;
    };
  }, [enabled]);

  // Establish a baseline so we don't notify for old rows.
  useEffect(() => {
    if (!enabled) return;
    let alive = true;

    const init = async () => {
      try {
        const { data, error } = await supabase
          .from("Bookings")
          .select("id,created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!alive) return;
        if (error) {
          baselineRef.current = null;
        } else {
          baselineRef.current = data?.created_at || null;
        }
      } finally {
        if (alive) setReady(true);
      }
    };

    init();
    return () => {
      alive = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready) return;

    const channel = supabase
      .channel("admin-booking-notify")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Bookings",
        },
        async (payload) => {
          const row = payload?.new;
          if (!row) return;

          if (String(row.status || "").toLowerCase() !== "pending") return;

          // Ignore rows that existed before we mounted.
          const base = baselineRef.current;
          if (base && row.created_at && String(row.created_at) <= String(base)) return;

          const id = row.id;
          if (id == null) return;
          const key = String(id);
          if (seenRef.current.has(key)) return;
          seenRef.current.add(key);

          setItems((prev) => [{
            id: key,
            created_at: row.created_at || null,
            label: displayName(row),
          }, ...prev].slice(0, 5));

          // Sound should play even when tab is not active (background tab).
          // Browsers may still require a prior user interaction.
          await playBeep(audioRef.current);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, ready]);

  useEffect(() => {
    if (!latest) return;
    const t = window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== latest.id));
    }, 8000);
    return () => window.clearTimeout(t);
  }, [latest]);

  if (!enabled) return null;
  if (!latest) return null;

  return (
    <div className="admin-notify" role="status" aria-live="polite">
      <button
        type="button"
        className="admin-notify__card"
        onClick={() => {
          setItems([]);
          navigate("/account/bookings");
        }}
      >
        <div className="admin-notify__title">New booking request</div>
        <div className="admin-notify__msg">
          {latest.label}
        </div>
        <div className="admin-notify__meta">
          {count > 1 ? `${count} new requests` : "Open bookings"}
        </div>
      </button>
    </div>
  );
};

export default AdminBookingNotifier;
