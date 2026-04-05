"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ImageUploader } from "@/components/personas/ImageUploader"
import { TraitEditor } from "@/components/personas/TraitEditor"
import { LivePreview } from "@/components/personas/LivePreview"
import { DEFAULT_TRAIT_INPUTS, type TraitInputs } from "@/types/persona"

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "clamp(1.5rem, 3vw, 2.5rem)",
}

export default function PersonaEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [personaName, setPersonaName] = useState("")
  const [traits, setTraits] = useState<TraitInputs>(DEFAULT_TRAIT_INPUTS)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [status, setStatus] = useState<string>("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [nineGridUrl, setNineGridUrl] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/personas/" + id)
      const data = await res.json()
      setPersonaName(data.name)
      setStatus(data.status)
      setNineGridUrl(data.nine_grid_url)
      if (data.trait_inputs && Object.keys(data.trait_inputs).length > 0) {
        setTraits(data.trait_inputs as unknown as TraitInputs)
      }
    }
    load()
  }, [id])

  const handleAnalyzed = useCallback(
    (traitInputs: Record<string, unknown>) => {
      setTraits(traitInputs as unknown as TraitInputs)
    },
    []
  )

  async function handleSave() {
    setIsSaving(true)
    await fetch("/api/personas/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: personaName, trait_inputs: traits }),
    })
    setIsSaving(false)
  }

  async function handleFinalize() {
    setIsFinalizing(true)
    setStatus("finalizing")
    try {
      const res = await fetch("/api/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: id }),
      })
      const data = await res.json()
      setStatus(data.status)
      setNineGridUrl(data.nine_grid_url)
    } catch {
      setStatus("error")
      alert("Finalization failed. Please try again.")
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="container-app" style={{ padding: "var(--section-padding-sm) clamp(1.5rem, 4vw, 4rem)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => router.push("/studio")}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "var(--text-body)" }}
          >
            ← Back
          </button>
          <input
            value={personaName}
            onChange={(e) => setPersonaName(e.target.value)}
            placeholder="Persona Name"
            style={{
              fontSize: "var(--text-headline-3)",
              fontWeight: 700,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave} disabled={isSaving} style={{ padding: "8px 20px", fontSize: "var(--text-body-sm)", fontWeight: 600, borderRadius: "var(--radius-full)", border: "1.5px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", transition: "all 0.2s ease" }}>
            {isSaving ? "Saving…" : "Save Draft"}
          </button>
          <button onClick={handleFinalize} disabled={isFinalizing || status === "ready"} style={{ padding: "8px 20px", fontSize: "var(--text-body-sm)", fontWeight: 600, borderRadius: "var(--radius-full)", border: "none", background: status === "ready" ? "rgba(139,142,255,0.15)" : "var(--accent)", color: status === "ready" ? "var(--accent)" : "#fff", cursor: isFinalizing ? "wait" : "pointer", transition: "all 0.2s ease" }}>
            {isFinalizing ? "Finalizing…" : status === "ready" ? "✓ Finalized" : "Save Persona"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={cardStyle}>
            <ImageUploader personaId={id} onAnalyzed={handleAnalyzed} />
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontWeight: 600 }}>Character Traits</h3>
              <button
                style={{ fontSize: "var(--text-micro)", fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}
              >
                {showAdvanced ? "Hide Advanced" : "Show Advanced"}
              </button>
            </div>
            <TraitEditor traits={traits} onChange={setTraits} showAdvanced={showAdvanced} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={cardStyle}>
            <LivePreview personaId={id} traitInputs={traits} />
          </div>

          {nineGridUrl && (
            <div style={cardStyle}>
              <p style={{ fontSize: "var(--text-overline)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 16 }}>
                9-Grid Reference
              </p>
              <img src={nineGridUrl} alt="9-Grid" style={{ width: "100%", borderRadius: "var(--radius-lg)" }} />
            </div>
          )}

          {status === "finalizing" && (
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <p className="animate-pulse-subtle" style={{ fontSize: 32, marginBottom: 8 }}>⏳</p>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
                Generating 9-grid reference…<br />This may take up to 60 seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
