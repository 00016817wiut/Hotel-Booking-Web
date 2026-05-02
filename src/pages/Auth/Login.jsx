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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (!res.ok) {
      toast.error(res.message || "Login failed.");
      return;
    }
    toast.success("Signed in successfully.");
    navigate(next);
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Sign in to continue booking and save your preferences.</p>

        <form className="auth-form" onSubmit={submit}>
          <label className="auth-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email"/>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="auth-password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
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

          <div className="auth-actions">
            <button type="submit">Sign in</button>
            <Link to={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
            <Link to={`/forgot-password?next=${encodeURIComponent(next)}`}>Forgot password?</Link>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Login;
