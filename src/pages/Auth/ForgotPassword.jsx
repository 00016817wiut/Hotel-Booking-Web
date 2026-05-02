import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import "./Auth.css";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const value = String(email || "").trim();
    if (!value) return;

    setSending(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(value, { redirectTo });
      if (error) throw error;
      toast.success("Password reset email sent. Please check your inbox.");
      navigate(`/login?next=${encodeURIComponent(next)}`);
    } catch (err) {
      toast.error(err?.message || "Failed to send reset email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Reset password</h1>
        <p>Enter your email and we will send you a reset link.</p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <div className="auth-actions">
            <button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send reset link"}
            </button>
            <Link to={`/login?next=${encodeURIComponent(next)}`}>Back to login</Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
