
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary UI only. Real authentication will be connected to Supabase.
    setError("Authentication is not connected yet. Please try again after backend integration.");
  }

  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#171b35] p-12 text-white lg:flex">
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-bold">
            Campus<span className="text-indigo-400">Care</span>
          </Link>
          <p className="mt-2 text-sm text-[#a8aec7]">
            Campus Maintenance Management
          </p>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
            🏫
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            A better campus starts with your voice.
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#a8aec7]">
            Report maintenance problems, track progress, and help make your
            campus a better place for everyone.
          </p>

          <div className="mt-9 space-y-4 text-sm text-[#d1d5e5]">
            <p>✓ Report campus maintenance issues easily</p>
            <p>✓ Track your complaints in real time</p>
            <p>✓ Stay informed about resolution updates</p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-[#777f9f]">
          © 2026 CampusCare. All rights reserved.
        </p>

        <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      {/* Login form */}
      <section className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Campus<span className="text-brand">Care</span>
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-brand">
              WELCOME BACK
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Enter your credentials to access your CampusCare dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-brand"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-brand hover:underline"
            >
              Create account
            </Link>
          </p>

          <div className="mt-10 border-t border-border pt-6 text-center">
            <Link
              href="/complaints"
              className="text-xs font-medium text-muted hover:text-brand"
            >
              ← Back to complaints dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
