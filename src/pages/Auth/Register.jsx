import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Auth.css";

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
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="new-password"/>
          </label>

          <label className="auth-field">
            <span>Repeat Password*</span>
            <input
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              type="password"
              required
              autoComplete="new-password"
            />
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
