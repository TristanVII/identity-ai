"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  imageUrl?: string
}

export function ChatInterface() {
  const searchParams = useSearchParams()
  const personaId = searchParams.get("persona")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isGenerating])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || !personaId || isGenerating) return

    const userMsg: ChatMessage = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsGenerating(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: personaId, prompt: userMsg.content }),
      })
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Here\u2019s your image:", imageUrl: data.result_url },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        {!personaId && (
          <div style={{ textAlign: "center", color: "var(--text-subtle)", paddingTop: "20vh" }}>
            <p style={{ fontSize: "var(--text-headline-3)", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
              Select a persona
            </p>
            <p style={{ fontSize: "var(--text-body-sm)" }}>
              Choose one from the sidebar to start generating images.
            </p>
          </div>
        )}
        {personaId && messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-subtle)", paddingTop: "20vh" }}>
            <p style={{ fontSize: "var(--text-headline-3)", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
              Describe a scene
            </p>
            <p style={{ fontSize: "var(--text-body-sm)" }}>
              e.g. &quot;Drinking coffee at a Parisian cafe during golden hour.&quot;
            </p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className="animate-fade-in"
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div
                style={{
                  maxWidth: 480,
                  padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)" : "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                  background: msg.role === "user" ? "var(--accent)" : "var(--surface)",
                  color: msg.role === "user" ? "#fff" : "var(--text)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.5 }}>{msg.content}</p>
                {msg.imageUrl && (
                  <div style={{ marginTop: 12 }}>
                    <img src={msg.imageUrl} alt="Generated" style={{ borderRadius: "var(--radius-lg)", maxWidth: "100%" }} />
                    <a
                      href={msg.imageUrl}
                      download
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 8,
                        fontSize: "var(--text-micro)",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      Download &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                className="animate-pulse-subtle"
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>Generating&hellip;</p>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: "1px solid var(--border)",
          padding: 16,
          display: "flex",
          gap: 12,
          background: "var(--bg)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={personaId ? "Describe a scene\u2026" : "Select a persona first"}
          disabled={!personaId || isGenerating}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "var(--text-body-sm)",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="submit"
          disabled={!personaId || isGenerating || !input.trim()}
          style={{
            padding: "12px 24px",
            fontSize: "var(--text-body-sm)",
            fontWeight: 600,
            borderRadius: "var(--radius-full)",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            cursor: !personaId || isGenerating || !input.trim() ? "not-allowed" : "pointer",
            opacity: !personaId || isGenerating || !input.trim() ? 0.4 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}
