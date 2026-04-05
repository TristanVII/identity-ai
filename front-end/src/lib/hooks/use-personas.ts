"use client"

import { useState, useEffect, useCallback } from "react"
import type { Persona } from "@/types/persona"

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPersonas = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/personas")
      if (!res.ok) throw new Error("Failed to fetch personas")
      const data = await res.json()
      setPersonas(data.personas)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPersonas()
  }, [fetchPersonas])

  return { personas, isLoading, error, refetch: fetchPersonas }
}

export function usePersona(id: string | null) {
  const [persona, setPersona] = useState<Persona | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPersona = useCallback(async () => {
    if (!id) {
      setPersona(null)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/personas/${id}`)
      if (!res.ok) throw new Error("Failed to fetch persona")
      setPersona(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPersona()
  }, [fetchPersona])

  return { persona, isLoading, error, refetch: fetchPersona }
}
