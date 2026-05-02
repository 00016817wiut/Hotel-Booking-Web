import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext.jsx";
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

const validatePassword = (password) => {
  const issues = [];
  if (password.length < 8) issues.push("at least 8 characters");
  if (!/[a-z]/.test(password)) issues.push("one lowercase letter");
  if (!/[A-Z]/.test(password)) issues.push("one uppercase letter");
  if (!/\d/.test(password)) issues.push("one number");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) issues.push("one special character");

  if (!issues.length) return { ok: true };
  return { ok: false, message: `Password must contain ${issues.join(", ")}.` };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const pw = validatePassword(password);
    if (!pw.ok) {
      toast.error(pw.message);
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const res = await register({ firstName, lastName, email, phone, password });
    if (!res.ok) {
      toast.error(res.message || "Registration failed.");
      return;
    }

    if (res.needsEmailConfirm) {
      toast.success("Check your email to confirm your account, then sign in.");
      navigate(`/login?next=${encodeURIComponent(next)}`)
      return;
    }

    toast.success("Account created successfully.");
    navigate(next);
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p>Register now to continue booking.</p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>First Name*</span>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" required autoComplete="given-name" />
          </label>

          <label className="auth-field">
            <span>Last Name*</span>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" required autoComplete="family-name"/>
          </label>

          <label className="auth-field">
            <span>Email*</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email"/>
          </label>

          <label className="auth-field">
            <span>Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel"  autoComplete="tel"/>
          </label>

          <label className="auth-field">
            <span>Password*</span>
            <div className="auth-password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password__eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Eye open={showPassword} />
              </button>
            </div>
          </label>

          <label className="auth-field">
            <span>Repeat Password*</span>
            <div className="auth-password">
              <input
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                type={showRepeatPassword ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password__eye"
                onClick={() => setShowRepeatPassword((v) => !v)}
                aria-label={showRepeatPassword ? "Hide password" : "Show password"}
              >
                <Eye open={showRepeatPassword} />
              </button>
            </div>
          </label>

          <div className="auth-actions">
            <button type="submit">Create account</button>
            <Link to={`/login?next=${encodeURIComponent(next)}`}>I already have an account</Link>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Register;
