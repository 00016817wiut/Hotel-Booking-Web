import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import "./AccountPages.css";

const AccountRooms = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.profile?.role || "").toLowerCase() === "admin";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Rooms")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) toast.error(e?.message || "Failed to load rooms");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="account-page">
        <h1>Rooms</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>Rooms</h1>
        <p>Manage hotel rooms.</p>
      </header>

      {loading ? (
        <p className="account-page__muted">Loading…</p>
      ) : (
        <pre className="account-page__code">
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default AccountRooms;
