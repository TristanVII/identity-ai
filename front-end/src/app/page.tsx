"use client"

import Link from "next/link";

export default function Home() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100dvh - 60px)",
        padding: "var(--section-padding-lg) clamp(1.5rem, 4vw, 4rem)",
        textAlign: "center",
      }}
    >
      <div className="animate-fade-up" style={{ maxWidth: 720 }}>
        <p
          style={{
            fontSize: "var(--text-overline)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 24,
          }}
        >
          AI Character Consistency
        </p>
        <h1
          style={{
            fontSize: "var(--text-display)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Same face.{" "}
          <span style={{ color: "var(--text-muted)" }}>Every time.</span>
        </h1>
        <p
          style={{
            fontSize: "var(--text-body-lg)",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: 540,
            margin: "0 auto 48px",
          }}
        >
          Create AI personas once. Generate images and videos with identical
          likeness — no complex prompting required.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link
            href="/studio"
            style={{
              padding: "14px 32px",
              fontSize: "var(--text-body)",
              fontWeight: 600,
              borderRadius: "var(--radius-full)",
              background: "var(--accent)",
              color: "#fff",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.filter = "brightness(1.15)";
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 4px 20px rgba(139,142,255,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.filter = "";
              el.style.transform = "";
              el.style.boxShadow = "";
            }}
          >
            Open Studio
          </Link>
          <Link
            href="/playground"
            style={{
              padding: "14px 32px",
              fontSize: "var(--text-body)",
              fontWeight: 600,
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--border)",
              color: "var(--text)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--surface)";
              el.style.borderColor = "var(--border-hover)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.borderColor = "var(--border)";
            }}
          >
            Playground
          </Link>
        </div>
      </div>
    </section>
  );
}
