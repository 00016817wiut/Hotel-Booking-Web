import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import AdminCheckoutCalendar from "../../components/AdminCheckoutCalendar/AdminCheckoutCalendar.jsx";
import "./AccountPages.css";

const AccountDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = String(profile?.role || "").toLowerCase() === "admin";

  const [stats, setStats] = useState({ bookings: 0, users: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;

    const load = async () => {
      const [bookingsRes, usersRes] = await Promise.all([
        supabase.from("Bookings").select("id", { count: "exact", head: true }),
        supabase.from("Users").select("id", { count: "exact", head: true }),
      ]);
      if (!alive) return;
      setStats({
        bookings: bookingsRes.count ?? 0,
        users: usersRes.count ?? 0,
      });
    };

    load();
    return () => {
      alive = false;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="account-page">
        <h1>Dashboard</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>Dashboard</h1>
        <p>Quick overview of admin activity.</p>
      </header>

      <div className="account-page__card">
        <div className="account-page__section-title" style={{ marginBottom: 12 }}>
          Admin overview
        </div>
        <div className="admin-stats">
          <button type="button" className="admin-stat" onClick={() => navigate("/account/bookings")}>
            <span className="admin-stat__number">{stats.bookings}</span>
            <span className="admin-stat__label">Total bookings</span>
          </button>
          <button type="button" className="admin-stat" onClick={() => navigate("/account/users")}>
            <span className="admin-stat__number">{stats.users}</span>
            <span className="admin-stat__label">Total users</span>
          </button>
        </div>
      </div>

      <div className="account-page__card">
        <AdminCheckoutCalendar />
      </div>
    </div>
  );
};

export default AccountDashboard;
