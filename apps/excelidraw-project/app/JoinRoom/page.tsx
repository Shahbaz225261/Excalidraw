"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export default function RoomPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!slug.trim()) {
      setError("Please enter a room slug");
      return;
    }

    setLoading(true);
    try {
      // Get room ID from slug
      const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
      
      if (response.data.roomId) {
        setSuccess(`Found room! Redirecting...`);
        setTimeout(() => {
          router.push(`/canvas/${response.data.roomId}`);
        }, 1000);
      } else {
        setError(response.data.msg || "Room not found");
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to find room");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!roomName.trim()) {
      setError("Please enter a room name");
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to create a room");
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/room/CreateRoom`,
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.roomId) {
        setSuccess(`Room "${roomName}" created successfully! Redirecting...`);
        setTimeout(() => {
          router.push(`/room/${response.data.roomId}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStart = () => {
    // Generate a random room name and create it
    const randomName = `room-${Math.random().toString(36).substring(2, 8)}`;
    setRoomName(randomName);
    setIsCreating(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-card">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              Ex
            </div>
            <span className="font-semibold text-sm sm:text-base">
              Excalidraw Clone
            </span>
          </Link>

          {/* User Menu/Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/signin")}
              className="text-sm font-medium px-4 py-2 rounded-xl border border-border hover:bg-muted"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="text-sm font-medium px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Collaborative Whiteboarding Made Simple
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool. No sign-up required to join.
            </p>
          </div>

          {/* Room Actions Section */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Join Room Card */}
              <div className="rounded-3xl bg-card border border-border p-8">
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Join Existing Room</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter a room slug to join an existing collaboration session
                  </p>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-4">
                  {error && !isCreating && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Slug</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g., team-meeting-2024"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ask your team lead for the room slug
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading && !isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      "Join Room"
                    )}
                  </button>
                </form>
              </div>

              {/* Create Room Card */}
              <div className="rounded-3xl bg-card border border-border p-8">
                <div className="text-center mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Create New Room</h2>
                  <p className="text-sm text-muted-foreground">
                    Start a new collaboration session and invite others
                  </p>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-4">
                  {error && isCreating && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm">
                      {success}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Room Name</label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g., Design Brainstorming"
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Choose a unique name for your room
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading && isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      "Create Room"
                    )}
                  </button>

                  <div className="pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={handleQuickStart}
                      className="w-full rounded-xl border-2 border-border hover:bg-muted px-4 py-2.5 text-sm font-medium"
                    >
                      Quick Start (Generate Random Room)
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-2xl font-semibold text-center mb-8">Why Choose Our Platform?</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="text-center">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Real-time Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Work together with your team in real-time. See changes instantly.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="text-center">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Multiplayer Editing</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple users can edit the same canvas simultaneously without conflicts.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="text-center">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold mb-2">Smart Drawing</h4>
                  <p className="text-sm text-muted-foreground">
                    Intelligent shape recognition and drawing assistance for professional diagrams.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <button 
                  onClick={() => setSlug("demo-room")}
                  className="text-primary hover:underline font-medium"
                >
                  Try our demo room
                </button>{" "}
                or{" "}
                <Link href="/docs" className="text-primary hover:underline font-medium">
                  read the documentation
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}