import { Suspense } from "react"
import { PersonaSelector } from "@/components/playground/PersonaSelector"
import { ChatInterface } from "@/components/playground/ChatInterface"

export default function PlaygroundPage() {
  return (
    <div style={{ display: "flex", height: "calc(100dvh - 60px)" }}>
      <aside
        style={{
          width: 260,
          borderRight: "1px solid var(--border)",
          overflowY: "auto",
          flexShrink: 0,
          background: "var(--bg-alt)",
        }}
      >
        <Suspense fallback={<div style={{ padding: 16, color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>Loading…</div>}>
          <PersonaSelector />
        </Suspense>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Suspense fallback={<div style={{ padding: 24, color: "var(--text-muted)" }}>Loading…</div>}>
          <ChatInterface />
        </Suspense>
      </div>
    </div>
  )
}
