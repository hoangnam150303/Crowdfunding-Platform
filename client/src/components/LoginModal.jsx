import React, { useEffect, useRef, useState } from "react";
import { Register } from ".";

export default function LoginModal({ open, onClose, onSubmit, onGoogleLogin }) {
  const dialogRef = useRef(null);
  const [showRegister, setShowRegister] = useState(false);
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

            <button
              type="button"
              onClick={() => onGoogleLogin?.()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign up
              </button>
            </p>
            <Register
              open={showRegister}
              onClose={() => setShowRegister(false)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23.04 12.261c0-.815-.073-1.596-.209-2.348H12v4.44h6.204a5.302 5.302 0 0 1-2.299 3.477v2.886h3.72c2.177-2.006 3.415-4.963 3.415-8.455Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.957-1.073 7.943-2.906l-3.72-2.886c-1.033.693-2.355 1.103-4.223 1.103-3.24 0-5.985-2.187-6.968-5.13H1.196v3.02A12 12 0 0 0 12 24Z"
        fill="#34A853"
      />
      <path
        d="M5.032 14.181A7.206 7.206 0 0 1 4.65 12c0-.759.131-1.494.362-2.181V6.8H1.196A11.998 11.998 0 0 0 0 12c0 1.943.465 3.778 1.196 5.2l3.836-3.019Z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.771c1.76 0 3.337.604 4.584 1.789l3.43-3.43C17.954 1.2 15.24 0 12 0 7.315 0 3.278 2.69 1.196 6.8l3.816 3.019C6.995 6.958 9.74 4.77 12 4.77Z"
        fill="#EA4335"
      />
    </svg>
  );
}
