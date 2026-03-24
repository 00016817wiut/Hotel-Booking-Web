import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import "./AccountPages.css";

const AccountUsers = () => {
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
          .from("Users")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) toast.error(e?.message || "Failed to load users.");
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
        <h1>Users</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  // const toggleActive = async (auth_id, currentActive) => {
  //   try {
  //     const { error } = await supabase
  //       .from("Users")
  //       .update({ is_active: !currentActive })
  //       .eq("auth_id", auth_id);
  //     if (error) throw error;
  //     toast.success("User updated.");
  //     setRows((prev) =>
  //       prev.map((r) =>
  //         r.auth_id === auth_id ? { ...r, is_active: !currentActive } : r
  //       )
  //     );
  //   } catch (e) {
  //     toast.error(e?.message || "Failed to update user.");
  //   }
  // };

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>Users</h1>
        <p>Manage app users. Role changes are restricted for security.</p>
      </header>

      {loading ? (
        <p className="account-page__muted">Loading…</p>
      ) : rows.length ? (
        <div className="user-list">
          {rows.map((u) => (
            <article className="user-item" key={u.auth_id || u.id}>
              <div className="user-item__top">
                <div className="user-item__info">
                  <div className="user-item__email">{u.email || "-"}</div>
                  <div className="user-item__meta">
                    <span className={`user-item__role user-item__role--${u.role || "user"}`}>
                      {u.role || "user"}
                    </span>
                    <span className="user-item__active">
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* <button
                  type="button"
                  className="user-item__toggle"
                  onClick={() => toggleActive(u.auth_id, u.is_active)}
                >
                  {u.is_active ? "Deactivate" : "Activate"}
                </button> */}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="account-page__muted">No users found.</p>
      )}
    </div>
  );
};

export default AccountUsers;
