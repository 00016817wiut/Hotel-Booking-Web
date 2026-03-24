import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient.js";

const AdminUsers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Users").select("*").order("id", { ascending: false });
      if (error) throw error;
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (auth_id, next) => {
    try {
      const { error } = await supabase.from("Users").update({ is_active: next }).eq("auth_id", auth_id);
      if (error) throw error;
      toast.success("User updated.");
      setRows((prev) => prev.map((r) => (r.auth_id === auth_id ? { ...r, is_active: next } : r)));
    } catch (e) {
      toast.error(e?.message || "Failed to update user.");
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, color: "var(--color-primary-strong)" }}>Users</h1>
      <p style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
        Manage app users.
      </p>

      {loading ? (
        <p style={{ color: "var(--color-text-muted)" }}>Loading…</p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {rows.map((u) => (
            <article
              key={u.auth_id || u.id}
              style={{ border: "1px solid var(--color-border)", borderRadius: 14, padding: 12, background: "#fff" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontWeight: 800, color: "var(--color-primary-strong)" }}>
                  {u.email || "-"}
                  <span style={{ marginLeft: 8, fontWeight: 400, color: "var(--color-text-muted)" }}>
                    · {u.role || "user"}
                  </span>
                </div>

                {u.role !== 'admin' &&
                  <button
                    type="button"
                    onClick={() => toggleActive(u.auth_id, !u.is_active)}
                    style={{
                      minHeight: 38,
                      padding: "6px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      background: u.is_active ? "#fff" : "rgba(179, 32, 42, 0.08)",
                      color: "var(--color-primary-strong)",
                      cursor: "pointer",
                    }}
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                }
              </div>

              <div style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
                Name: {u.first_name || "-"}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
