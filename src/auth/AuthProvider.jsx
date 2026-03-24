import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";


const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  const userIdRef = useRef(null)

  // Session
  useEffect(() => {
    let alive = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;

      if (error) {
        setSession(null)
        setProfile(null)
        setProfileLoading(false)
        userIdRef.current = null
        setAuthReady(true)
        return;
      }

      const nextSession = data.session ?? null
      userIdRef.current = nextSession?.user?.id ?? null
      setSession(nextSession);
      setAuthReady(true)
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!alive) return;

      const nextId = nextSession?.user?.id ?? null
      const prevId = userIdRef.current
      userIdRef.current = nextId

      setSession(nextSession ?? null);

      // Keep cached profile on token refresh; only clear on user change/sign out
      if (!nextId || nextId !== prevId) {
        setProfile(null)
      }
      setAuthReady(true);
    })

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    }
  }, [])

  // Load profile
  useEffect(() => {
    let alive = true;

    const loadProfile = async () => {
      const authUser = session?.user;

      if (!authUser) {
        setProfile(null)
        setProfileLoading(false)
        return;
      }

      setProfileLoading(true)

      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("auth_id", authUser.id)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        // Avoid dropping admin UI on transient errors; keep last known profile
        setProfile((prev) => prev)
        setProfileLoading(false)
        return;
      }

      setProfile(data ?? null)
      setProfileLoading(false)
    }
    loadProfile();
    return () => {
      alive = false;
    }
  }, [session?.user?.id])

  // Register user
  const register = useCallback(async ({ firstName, lastName, email, phone, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
        }
      }
    })
    if (error) return { ok: false, message: error.message };

    // with email confirmation On, session is usally null here
    if (!data.session) {
      return {
        ok: true, needsEmailConfirm: true,
      };
    }

    return { ok: true };
  }, [])


  // Login
  const login = useCallback(async ({email, password}) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: error.message }
    if (!data.session) return { ok: false, message: "No session returned." }
    return { ok: true }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, [])

  // User session info
  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    profile,
  }
    : null;

  const value = useMemo(
    () => ({ user, session, profile, profileLoading, authReady, register, login, logout }),
    [user, session, profile, profileLoading, authReady, register, login, logout]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export default AuthProvider;
