import React, { useEffect, useRef, useState } from "react";
import authApi from "../hooks/auth.api";
import { Login } from ".";

export default function RegisterModal({ open, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const loginWithGoogle = async () => {
    try {
      await authApi.postLoginWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  async function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    await onSubmit?.({ email, password });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900"
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <h2
            id="login-title"
            className="text-xl font-semibold tracking-tight dark:text-white"
          >
            Sign in
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-white/10"
            aria-label="Close"
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form onSubmit={submitHandler} className="px-6 pb-6 pt-4">
          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="Name"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-200"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign in
            </button>

            <div className="relative py-2 text-center text-xs text-neutral-500">
              <span className="bg-white px-2 dark:bg-neutral-900">or</span>
              <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-neutral-200 dark:bg-neutral-700" />
            </div>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
              Already have account?{" "}
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign In
              </button>
              <Login
                open={showLogin}
                onClose={() => setShowLogin(false)}
                onSubmit={async ({ email, password }) => {
                  try {
                    const res = await authApi.postLoginLocal({
                      email,
                      password,
                    });
                    console.log("Login response:", res);
                  } catch (error) {
                    console.log(error);
                  }
                  setShowLogin(false);
                }}
                onGoogleLogin={loginWithGoogle}
              />
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
