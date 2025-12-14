// app/page.tsx  (App Router)
"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, #4f46e5 0, #020617 45%), radial-gradient(circle at bottom right, #22c55e 0, #020617 55%)",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 28,
          border: "1px dashed rgba(148,163,184,0.7)",
          backgroundColor: "rgba(15,23,42,0.9)",
          padding: "2.5rem 2.25rem",
          boxShadow: "0 32px 80px rgba(15,23,42,0.9)",
        }}
      >
        {/* fake window header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "1.75rem",
          }}
        >
          {["#f97316", "#facc15", "#22c55e"].map((c) => (
            <div
              key={c}
              style={{
                width: 12,
                height: 12,
                borderRadius: "999px",
                background: c,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.08,
              color: "#9ca3af",
            }}
          >
            Excalidraw Auth
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome to SketchRooms
        </h1>
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "2rem",
            maxWidth: 420,
          }}
        >
          Spin up collaborative whiteboards in seconds with an Excalidraw‑style
          experience.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/SignUp")}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "0.9rem 1.4rem",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              background:
                "linear-gradient(135deg, #4f46e5 0%, #22c55e 45%, #38bdf8 100%)",
              color: "#020617",
              boxShadow: "0 18px 45px rgba(56,189,248,0.45)",
            }}
          >
            Create a new account
          </button>

          <button
            type="button"
            onClick={() => router.push("/SignIn")}
            style={{
              flex: 1,
              minWidth: 160,
              padding: "0.9rem 1.4rem",
              borderRadius: 999,
              border: "1px dashed #4b5563",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 15,
              background:
                "repeating-linear-gradient(135deg, #020617, #020617 4px, #020819 4px, #020819 8px)",
              color: "#e5e7eb",
            }}
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}
