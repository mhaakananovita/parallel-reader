"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./AuthPanel.module.css";

export default function AuthPanel() {
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Enter your email address.");
      return;
    }

    setSending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
      setSending(false);
      return;
    }

    setMessage("Sign-in link sent. Check your email.");
    setSending(false);
  }

  async function signOut() {
    setSending(true);
    await supabase.auth.signOut();
    setMessage("");
    setSending(false);
  }

  if (loading) {
    return (
      <div className={styles.panel}>
        <span className={styles.status}>Checking sign-in…</span>
      </div>
    );
  }

  if (userEmail) {
    return (
      <div className={styles.panel}>
        <div className={styles.signedIn}>
          <div>
            <span className={styles.statusLabel}>Signed in</span>
            <span className={styles.email}>{userEmail}</span>
          </div>

          <button
            className={styles.secondaryButton}
            type="button"
            onClick={signOut}
            disabled={sending}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.signIn}>
        <div>
          <strong>Sign in to EchoText</strong>
          <p className={styles.help}>
            Your readings and notes will follow you across devices.
          </p>
        </div>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signIn();
              }
            }}
          />

          <button
            className={styles.button}
            type="button"
            onClick={signIn}
            disabled={sending}
          >
            {sending ? "Sending…" : "Email me a sign-in link"}
          </button>
        </div>

        {message && (
          <p className={styles.message}>{message}</p>
        )}
      </div>
    </div>
  );
}