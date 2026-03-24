import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import "./AccountPages.css";

const AccountInfo = () => {
  const { user, profile, logout } = useAuth();

  const initial = useMemo(() => {
    return {
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      phone: profile?.phone ?? "",
    }
  }, [profile?.first_name, profile?.last_name, profile?.phone])

  const [firstName, setFirstName] = useState(initial.first_name);
  const [lastName, setLastName] = useState(initial.last_name);
  const [phone, setPhone] = useState(initial.phone);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      const patch = {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        phone: phone.trim() || null,
      }

      const { error } = await supabase.from("Users").update(patch).eq("auth_id", user.id);
      if (error) throw error;

      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile.")
    } finally {
      setSaving(false);
    }
  }

  const onLogout = async () => {
    await logout();
    toast.success("Logged out")
  }

  return (
    <div className="account-page">
      <header className="account-page__header">
        <h1>Personal info</h1>
        <p>Update your details used for bookings and contact.</p>
      </header>

      <div className="account-page__card">
        <div className="account-page__row">
          <div className="account-page__label">Email</div>
          <div className="account-page__value">{user?.email || "-"}</div>
        </div>
      </div>

      <form className="account-page__card account-form" onSubmit={submit}>
        <label className="account-form__field">
          <span>First name</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" autoComplete="given-name" />
        </label>

        <label className="account-form__field">
          <span>Last name</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" autoComplete="family-name" />
        </label>

        <label className="account-form__field">
          <span>Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" />
        </label>

        <div className="account-form__actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
      <div className="logout-row">
        <button onClick={onLogout} className="logout-button">Log Out</button>
      </div>
    </div>
  )
}

export default AccountInfo