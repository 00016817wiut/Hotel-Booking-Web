import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

const USERS_KEY = "anor_users";
const CURRENT_KEY = "anor_auth_user";

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = readJSON(CURRENT_KEY, null);
    setUser(current);
  }, []);

  const register = useCallback(({ name, email, password }) => {
    const users = readJSON(USERS_KEY, []);
    const exists = users.some((u) => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (exists) {
      return { ok: false, message: "User already exists." };
    }

    const newUser = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name,
      email,
      password,
    };

    users.push(newUser);
    writeJSON(USERS_KEY, users);

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    writeJSON(CURRENT_KEY, safeUser);
    setUser(safeUser);

    return { ok: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = readJSON(USERS_KEY, []);
    const found = users.find((u) => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, message: "Invalid email or password." };
    }

    const safeUser = { id: found.id, name: found.name, email: found.email };
    writeJSON(CURRENT_KEY, safeUser);
    setUser(safeUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, register, login, logout }), [user, register, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
