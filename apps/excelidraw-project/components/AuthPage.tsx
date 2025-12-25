"use client";

import { BACKEND_URL } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const nameRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = userRef.current?.value;
    const password = passRef.current?.value;
    const name = nameRef.current?.value;

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (!isSignin && !name) {
      setError("Name is required for sign up");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/${isSignin ? "signin" : "signup"}`,
        {
          username: email,
          password,
          name: name,
        }
      );

      // Store token if your backend returns one
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Redirect to home or dashboard
      if(!isSignin){
        router.push("/signin");
      }
      else{
        router.push("/JoinRoom");

      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-card">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              Ex
            </div>
            <span className="font-semibold text-sm sm:text-base">
              Excalidraw Clone
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
            aria-label="Open menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
              <span className="block h-0.5 w-4 bg-foreground" />
            </div>
          </button>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-card shadow-lg border border-border p-8">
          <h1 className="text-2xl font-semibold mb-2">
            {isSignin ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isSignin
              ? "Welcome back. Please enter your details."
              : "Join the canvas and start sketching with your team."}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignin && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  ref={nameRef}
                  required
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Shahbaz"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                ref={userRef}
                type="email"
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                ref={passRef}
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {isSignin && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-input" 
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="font-medium text-primary hover:underline disabled:opacity-50"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {isSignin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isSignin ? "Sign in" : "Sign up"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <Link
              href={isSignin ? "/signup" : "/signin"}
              className="font-medium text-primary hover:underline"
            >
              {isSignin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}