import { Suspense } from "react"
import { PersonaSelector } from "@/components/playground/PersonaSelector"
import { VideoUploader } from "@/components/motion-lab/VideoUploader"

export default function MotionLabPage() {
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
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--section-padding-sm) clamp(1.5rem, 4vw, 4rem)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: "var(--text-headline-2)", fontWeight: 700, letterSpacing: "-0.02em" }}>Motion Lab</h1>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", marginTop: 8 }}>
              Upload a reference video and swap your persona&apos;s face onto the subject.
            </p>
          </div>
          <Suspense fallback={<div style={{ color: "var(--text-muted)" }}>Loading…</div>}>
            <VideoUploader />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
