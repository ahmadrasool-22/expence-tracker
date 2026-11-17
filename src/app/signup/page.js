
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(
      "Account creation is not connected yet. Please try again after backend integration."
    );
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
            Make your campus better, one report at a time.
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#a8aec7]">
            Join CampusCare to report maintenance issues, follow complaint
            progress, and contribute to a better learning environment.
          </p>

          <div className="mt-9 space-y-4 text-sm text-[#d1d5e5]">
            <p>✓ Create and manage your complaints</p>
            <p>✓ Follow maintenance progress</p>
            <p>✓ Help improve your campus</p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-[#777f9f]">
          © 2026 CampusCare. All rights reserved.
        </p>

        <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      {/* Signup form */}
      <section className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Campus<span className="text-brand">Care</span>
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-brand">
              GET STARTED
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Join CampusCare and start reporting campus maintenance issues.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                required
              />
            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
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

              <p className="mt-1 text-xs text-muted">
                Use at least 6 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/10"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-8 border-t border-border pt-5 text-center">
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
