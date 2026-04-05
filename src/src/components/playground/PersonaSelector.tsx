"use client"

import { usePersonas } from "@/lib/hooks/use-personas"
import { useSearchParams, useRouter } from "next/navigation"

export function PersonaSelector() {
  const { personas, isLoading } = usePersonas()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeId = searchParams.get("persona")

  const readyPersonas = personas.filter((p) => p.status === "ready")

  function select(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("persona", id)
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <div style={{ padding: 16, fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>Loading…</div>

  if (readyPersonas.length === 0) {
    return (
      <div style={{ padding: 20, fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
        No finalized personas. Go to Studio to create one.
      </div>
    )
  }

  return (
    <div style={{ padding: 12 }}>
      <p style={{ fontSize: "var(--text-overline)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-subtle)", padding: "8px 8px 12px" }}>
        Personas
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {readyPersonas.map((p) => (
          <button
            key={p.id}
            onClick={() => select(p.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: "var(--radius-lg)",
              border: "none",
              background: activeId === p.id ? "var(--accent-muted)" : "transparent",
              cursor: "pointer",
              transition: "background 0.15s ease",
              width: "100%",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (activeId !== p.id) e.currentTarget.style.background = "var(--surface-hover)"
            }}
            onMouseLeave={(e) => {
              if (activeId !== p.id) e.currentTarget.style.background = "transparent"
            }}
          >
            {p.nine_grid_url ? (
              <img src={p.nine_grid_url} alt={p.name} style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--bg-alt)" }} />
            )}
            <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, color: activeId === p.id ? "var(--accent)" : "var(--text)" }}>
              {p.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
