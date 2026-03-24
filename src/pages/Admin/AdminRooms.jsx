import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient.js";

const AdminRooms = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("Rooms").select("*").order("id", { ascending: true });
        if (error) throw error;
        if (!alive) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        toast.error(e?.message || "Failed to load rooms.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h1 style={{ margin: 0, color: "var(--color-primary-strong)" }}>Rooms</h1>
      <p style={{ marginTop: 8, color: "var(--color-text-muted)" }}>Create/edit rooms.</p>

      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      ) : (
        <pre style={{ marginTop: 14, background: "#fff", border: "1px solid var(--color-border)", borderRadius: 14, padding: 12, overflow: "auto" }}>
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default AdminRooms;
