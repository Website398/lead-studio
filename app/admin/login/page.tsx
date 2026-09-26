"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      router.replace("/admin");
    } catch (err: unknown) {
      console.error("Firebase Login Error:", err);

      const firebaseError = err as {
        code?: string;
        message?: string;
      };

      console.error("Firebase error code:", firebaseError.code);
      console.error("Firebase error message:", firebaseError.message);

      switch (firebaseError.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/user-not-found":
          setError("Admin account not found.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email.");
          break;

        case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
          setError(
            "Firebase API key is invalid. Check your Firebase project configuration."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/Password authentication is not enabled in Firebase."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many attempts. Please wait and try again."
          );
          break;

        default:
          setError(
            firebaseError.code
              ? `Firebase error: ${firebaseError.code}`
              : "Login failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="admin-login-page">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Checking session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page">

      <div className="admin-bg admin-bg-one" />
      <div className="admin-bg admin-bg-two" />

      <div className="admin-login-wrapper">

        <div className="admin-login-card">

          {/* LOGO */}
          <div className="admin-brand">
            <div className="admin-logo">
              LS
            </div>

            <div>
              <div className="admin-brand-name">
                LeadStudio
              </div>

              <div className="admin-brand-subtitle">
                Admin Panel
              </div>
            </div>
          </div>

          {/* HEADING */}
          <div className="admin-heading">

            <div className="admin-badge">
              <span />
              Private access
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to manage your website leads.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="admin-form"
          >

            <div className="admin-field">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                autoComplete="email"
                disabled={loading}
              />

            </div>

            <div className="admin-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

            </div>

            {/* ERROR */}
            {error && (
              <div className="admin-error">
                <div className="admin-error-icon">
                  !
                </div>

                <div>
                  <strong>Login failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="admin-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-button-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          {/* SECURITY */}
          <div className="admin-security">
            <span>✓</span>
            Secure Firebase authentication
          </div>

        </div>

        <div className="admin-copyright">
          © {new Date().getFullYear()} LeadStudio
        </div>

      </div>

    </main>
  );
}