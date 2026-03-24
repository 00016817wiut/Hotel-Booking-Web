import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext.jsx";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password"/>
          </label>

          <div className="auth-actions">
            <button type="submit">Sign in</button>
            <Link to={`/register?next=${encodeURIComponent(next)}`}>Create an account</Link>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Login;
