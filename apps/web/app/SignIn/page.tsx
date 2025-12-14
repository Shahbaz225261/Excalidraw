"use client";

import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
export default function SignUp() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const router                  = useRouter();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      {/* Left: form */}
      <div
        style={{
          flex: 1,
          padding: "3rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #4f46e5 0%, #22c55e 40%, #38bdf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            EX
          </div>
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Get started for free
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
          Create your Excalidraw workspace and start sketching ideas in seconds.
        </p>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: 420,
          }}
        >

          <div>
            <label
              style={{ display: "block", fontSize: 14, marginBottom: 4 }}
            >
              Email
            </label>
            <input
            onChange={(e)=>{
              setEmail(e.target.value);
            }}
              type="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.75rem 0.9rem",
                borderRadius: 999,
                border: "1px solid #1f2937",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: 14, marginBottom: 4 }}
            >
              Password
            </label>
            <input
            onChange={(e)=>{
              setPassword(e.target.value);
            }}
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem 0.9rem",
                borderRadius: 999,
                border: "1px solid #1f2937",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                outline: "none",
              }}
            />
          </div>

          <button
          type="button"
       onClick={async () => {
              try {
                const res = await axios.post(`${BACKEND_URL}/user/signin`, {
                  username: email,
                  password,
                });
                console.log(res);

                // only success reaches here
                router.push("/Dashboard");

              } catch (err: any) {
                if (err.response) {
                  alert(err.response.data.msg || "Wrong password");
                } else {
                  alert("Server error");
                }
              }
          }}

            
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem 1rem",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15,
              background:
                "linear-gradient(135deg, #4f46e5 0%, #22c55e 50%, #38bdf8 100%)",
              color: "#0b1120",
              boxShadow: "0 18px 45px rgba(15, 118, 110, 0.45)",
            }}
          >
            Sign In
          </button>

          <p style={{ fontSize: 12, color: "#6b7280", marginTop: "0.75rem" }}>
            By continuing, you agree to the Terms and acknowledge the Privacy Policy.
          </p>
        </form>
      </div>

      {/* Right: Excalidraw-style panel */}
      <div
        style={{
          flex: 1,
          padding: "3rem 3.5rem",
          background:
            "radial-gradient(circle at top left, #4f46e5 0, #020617 45%), radial-gradient(circle at bottom right, #22c55e 0, #020617 55%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            borderRadius: 24,
            border: "1px dashed rgba(148, 163, 184, 0.7)",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            padding: "1.75rem 1.5rem",
            backdropFilter: "blur(18px)",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.9)",
          }}
        >
          {/* top toolbar mimic */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: "#f97316",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: "#facc15",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "999px",
                background: "#22c55e",
              }}
            />
            <div
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "#9ca3af",
                letterSpacing: 0.08,
                textTransform: "uppercase",
              }}
            >
              Live sketch preview
            </div>
          </div>

          {/* canvas */}
          <div
            style={{
              borderRadius: 20,
              background: "#020617",
              padding: "1.25rem",
              border: "1px solid #1e293b",
              display: "grid",
              gridTemplateColumns: "56px 1fr",
              gap: "1rem",
            }}
          >
            {/* fake toolbar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
              }}
            >
              {["✏️", "⬜", "➰", "⬈", "A"].map((tool) => (
                <div
                  key={tool}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: "#020617",
                    border: "1px solid #1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: "#e5e7eb",
                  }}
                >
                  {tool}
                </div>
              ))}
            </div>

            {/* sketchy cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  height: 90,
                  borderRadius: 18,
                  border: "2px solid #4f46e5",
                  background:
                    "repeating-linear-gradient(135deg, #020617, #020617 4px, #020817 4px, #020817 8px)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  height: 56,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    borderRadius: 18,
                    border: "2px dashed #22c55e",
                    background:
                      "repeating-linear-gradient(135deg, #020617, #020617 4px, #02131b 4px, #02131b 8px)",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    borderRadius: 18,
                    border: "2px dashed #38bdf8",
                    background:
                      "repeating-linear-gradient(135deg, #020617, #020617 4px, #02101e 4px, #02101e 8px)",
                  }}
                />
              </div>
            </div>
          </div>

          <p
            style={{
              marginTop: "1.25rem",
              fontSize: 13,
              color: "#cbd5f5",
              maxWidth: 360,
              lineHeight: 1.5,
            }}
          >
            Sketch user flows, system designs, and whiteboard interviews with a
            playful, hand‑drawn canvas inspired by Excalidraw.
          </p>
        </div>
      </div>
    </div>
  );
}