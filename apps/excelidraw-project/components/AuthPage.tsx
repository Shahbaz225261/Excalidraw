"use client";

import Link from "next/link";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* hamburger */}
         <header className="w-full border-b border-border bg-card">
          <div className="px-6 py-3 flex items-center justify-between">
            {/* left: logo + text */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                Ex
              </div>
              <span className="font-semibold text-sm sm:text-base">
                Excalidraw Clone
              </span>
            </Link>

            {/* right: hamburger */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
            >
              <span className="sr-only">Open menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
                <span className="block h-0.5 w-4 bg-foreground" />
              </div>
            </button>
          </div>
      </header>

        
      {/* Centered auth card */}
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

          <form className="space-y-4">
            <div>
                {!isSignin && (
                    <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="email"
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Shahbaz"
                    />
                    </div>
                )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {isSignin && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-input" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
            onClick={()=>{
                
            }}
              type="button"
              className="mt-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg"
            >
              {isSignin ? "Sign in" : "Sign up"}
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
