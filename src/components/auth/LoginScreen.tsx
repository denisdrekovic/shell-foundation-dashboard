"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Small delay for UX feel
    setTimeout(() => {
      const ok = login(username.trim(), password);
      if (!ok) {
        setError(true);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-deep-purple text-white mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-xl font-bold font-[var(--font-heading)] text-title">
            Shell Foundation
          </h1>
          <p className="text-sm text-gray mt-1">
            Rapid Impact Assessment Dashboard
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-medium text-gray uppercase tracking-wide mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className="w-full px-3 py-2.5 rounded-[var(--radius-button)] border border-surface-alt bg-surface text-sm text-title placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum transition-colors"
                placeholder="Enter username"
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-medium text-gray uppercase tracking-wide mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full px-3 py-2.5 rounded-[var(--radius-button)] border border-surface-alt bg-surface text-sm text-title placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-plum/40 focus:border-plum transition-colors"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-[11px] text-income-low font-medium" role="alert">
                Invalid username or password. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 rounded-[var(--radius-button)] bg-deep-purple text-white text-sm font-semibold hover:bg-plum transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-plum/40"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray mt-4">
          Access is restricted to authorized viewers only.
        </p>
      </div>
    </div>
  );
}
