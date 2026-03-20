import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Auth.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const res = register({ name, email, password });
    if (!res.ok) {
      setError(res.message || "Registration failed.");
      return;
    }

    navigate(next);
  };

  return (
    <section className="auth-page">
      <div className="auth-card content">
        <h1>Create account</h1>
        <p>Register now to continue booking.</p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          <div className="auth-actions">
            <button type="submit">Create account</button>
            <Link to={`/login?next=${encodeURIComponent(next)}`}>I already have an account</Link>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default Register;
