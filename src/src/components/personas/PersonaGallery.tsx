"use client"

import Link from "next/link"
import { usePersonas } from "@/lib/hooks/use-personas"

export function PersonaGallery() {
  const { personas, isLoading, refetch } = usePersonas()

  async function handleCreate() {
    const name = prompt("Persona name:")
    if (!name) return
    await fetch("/api/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    refetch()
  }

  if (isLoading) {
    return (
      <div style={{ padding: "var(--section-padding-md) 0", textAlign: "center", color: "var(--text-muted)" }}>
        Loading personas…
      </div>
    )
  }

  return (
    <div style={{ padding: "var(--section-padding-sm) 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-headline-2)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Your Personas
          </h1>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", marginTop: 8 }}>
            Create and manage your AI character identities.
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            padding: "10px 24px",
            fontSize: "var(--text-body-sm)",
            fontWeight: 600,
            borderRadius: "var(--radius-full)",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          + New Persona
        </button>
      </div>

      {personas.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--section-padding-md) 0",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "var(--text-headline-3)", marginBottom: 12 }}>No personas yet</p>
          <p style={{ fontSize: "var(--text-body-sm)" }}>Create your first one to get started.</p>
        </div>
      ) : (
        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {personas.map((p) => (
            <Link key={p.id} href={`/studio/${p.id}`}>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: 16,
                  cursor: "pointer",
                  transition: "transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo), border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = "translateY(-4px)"
                  el.style.boxShadow = "var(--shadow-lg)"
                  el.style.borderColor = "var(--border-hover)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = ""
                  el.style.boxShadow = ""
                  el.style.borderColor = "var(--border)"
                }}
              >
                {p.nine_grid_url ? (
                  <img
                    src={p.nine_grid_url}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "var(--radius-lg)" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: "var(--bg-alt)",
                      borderRadius: "var(--radius-lg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-subtle)",
                      fontSize: "var(--text-body-sm)",
                    }}
                  >
                    No preview
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: "var(--text-body-sm)" }}>{p.name}</span>
                  <span
                    style={{
                      fontSize: "var(--text-micro)",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: p.status === "ready" ? "var(--accent-muted)" : "rgba(255,255,255,0.06)",
                      color: p.status === "ready" ? "var(--accent)" : "var(--text-subtle)",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
