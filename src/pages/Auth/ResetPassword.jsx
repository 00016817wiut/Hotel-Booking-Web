import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import "./Auth.css";

const Eye = ({ open }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    {open ? (
      <path
        fill="currentColor"
        d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5.5Z"
      />
    ) : (
      <path
        fill="currentColor"
        d="M2.1 3.51 3.5 2.1 21.9 20.49 20.49 21.9l-2.3-2.3A11.67 11.67 0 0 1 12 21C7 21 2.73 17.89 1 14c.77-1.73 2.05-3.27 3.66-4.5L2.1 3.51ZM12 7c1.07 0 2.1.2 3.06.56L13.3 9.32A2.5 2.5 0 0 0 9.32 13.3l-1.76 1.76C7.2 14.1 7 13.07 7 12a5 5 0 0 1 5-5Zm10 7c-.6 1.35-1.53 2.6-2.72 3.67l-1.45-1.45A9.42 9.42 0 0 0 20.8 14c-1.48-3.1-5.24-5.5-8.8-5.5-.62 0-1.23.07-1.82.2L8.97 7.49A11.9 11.9 0 0 1 12 7c5 0 9.27 3.11 11 7Z"
      />
    )}
  </svg>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  // Supabase sets a recovery session after the user clicks the email link.
  useEffect(() => {
    let alive = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setReady(Boolean(data.session));
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return;
      if (event === "PASSWORD_RECOVERY") setReady(true);
      else if (!session) setReady(false);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!ready) {
      toast.error("Reset link is invalid or expired.");
      return;
    }

    if (!pw || pw.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (pw !== pw2) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      navigate(`/login?next=${encodeURIComponent(next)}`);
    } catch (err) {
      toast.error(err?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Set a new password</h1>
        <p>Enter a new password for your account.</p>

        {!ready ? (
          <div className="auth-error" style={{ marginTop: 12 }}>
            Reset link is invalid or expired. Please request a new one.
          </div>
        ) : null}

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>New password</span>
            <div className="auth-password">
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password__eye"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                <Eye open={showPw} />
              </button>
            </div>
          </label>

          <label className="auth-field">
            <span>Repeat new password</span>
            <div className="auth-password">
              <input
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                type={showPw2 ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password__eye"
                onClick={() => setShowPw2((v) => !v)}
                aria-label={showPw2 ? "Hide password" : "Show password"}
              >
                <Eye open={showPw2} />
              </button>
            </div>
          </label>

          <div className="auth-actions">
            <button type="submit" disabled={saving || !ready}>
              {saving ? "Saving..." : "Update password"}
            </button>
            <Link to={`/forgot-password?next=${encodeURIComponent(next)}`}>Request new reset link</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
