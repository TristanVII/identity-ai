import { NextResponse } from "next/server"
import { downloadBlob } from "@/lib/azure/blob"
import type { ContainerName } from "@/lib/azure/blob"

const VALID_CONTAINERS = new Set([
  "source-images",
  "nine-grids",
  "generated-images",
  "videos-input",
  "videos-output",
])

const MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  if (!path || path.length < 2) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 })
  }

  const [container, ...rest] = path
  const blobName = rest.join("/")

  if (!VALID_CONTAINERS.has(container)) {
    return NextResponse.json({ error: "Invalid container" }, { status: 400 })
  }

  try {
    const data = await downloadBlob(container as ContainerName, blobName)
    const ext = blobName.split(".").pop()?.toLowerCase() ?? ""
    const contentType = MIME_MAP[ext] ?? "application/octet-stream"

    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, immutable",
      },
    })
  } catch (err) {
    console.error("Blob proxy error:", err)
    return NextResponse.json({ error: "Blob not found" }, { status: 404 })
  }
}
