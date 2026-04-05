import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound, badRequest, serverError } from "@/lib/utils/errors"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [persona] = await db
      .select({
        id: personas.id,
        name: personas.name,
        source_image_url: personas.source_image_url,
        nine_grid_url: personas.nine_grid_url,
        trait_inputs: personas.trait_inputs,
        status: personas.status,
        created_at: personas.created_at,
        updated_at: personas.updated_at,
      })
      .from(personas)
      .where(eq(personas.id, id))

    if (!persona) return notFound("Persona not found")
    return NextResponse.json(persona)
  } catch (err) {
    console.error("GET /api/personas/[id] error:", err)
    return serverError("Failed to fetch persona")
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        return badRequest("Name must be a non-empty string")
      }
      updates.name = body.name.trim()
    }
    if (body.trait_inputs !== undefined) {
      updates.trait_inputs = body.trait_inputs
    }

    if (Object.keys(updates).length === 0) {
      return badRequest("No valid fields to update")
    }

    updates.updated_at = new Date()

    const [updated] = await db
      .update(personas)
      .set(updates)
      .where(eq(personas.id, id))
      .returning()

    if (!updated) return notFound("Persona not found")
    return NextResponse.json(updated)
  } catch (err) {
    console.error("PATCH /api/personas/[id] error:", err)
    return serverError("Failed to update persona")
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [deleted] = await db
      .delete(personas)
      .where(eq(personas.id, id))
      .returning({ id: personas.id })

    if (!deleted) return notFound("Persona not found")
    return NextResponse.json({ deleted: true })
  } catch (err) {
    console.error("DELETE /api/personas/[id] error:", err)
    return serverError("Failed to delete persona")
  }
}
