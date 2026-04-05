import { NextResponse } from "next/server"
import { db } from "@/lib/azure/db"
import { personas } from "@/db/schema"
import { desc } from "drizzle-orm"
import { badRequest, serverError } from "@/lib/utils/errors"

export async function GET() {
  try {
    const rows = await db
      .select({
        id: personas.id,
        name: personas.name,
        nine_grid_url: personas.nine_grid_url,
        status: personas.status,
        created_at: personas.created_at,
      })
      .from(personas)
      .orderBy(desc(personas.created_at))

    return NextResponse.json({ personas: rows })
  } catch (err) {
    console.error("GET /api/personas error:", err)
    return serverError("Failed to fetch personas")
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return badRequest("Name is required")
    }

    const [created] = await db
      .insert(personas)
      .values({ name: name.trim() })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error("POST /api/personas error:", err)
    return serverError("Failed to create persona")
  }
}
