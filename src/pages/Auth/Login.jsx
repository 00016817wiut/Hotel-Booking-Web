import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const res = login({ email, password });
    if (!res.ok) {
      setError(res.message || "Login failed.");
      return;
    }
    navigate(next);
  };

  return (
    <section className="auth-page">
      <div className="auth-card content">
        <h1>Login</h1>
        <p>Sign in to continue booking and save your preferences.</p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          <div className="auth-actions">
            <button type="submit">Sign in</button>
            <Link to={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default Login;
