import { test, expect } from "@playwright/test"

// ─── Home Page ───────────────────────────────────────────────────────────────

test.describe("Home Page", () => {
  test("renders hero section with headline and CTAs", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText("Same face.")).toBeVisible()
    await expect(page.getByText("Every time.")).toBeVisible()
    await expect(page.getByText("AI Character Consistency")).toBeVisible()
    await expect(
      page.getByText("Create AI personas once")
    ).toBeVisible()

    const studioLink = page.getByRole("link", { name: "Open Studio" })
    await expect(studioLink).toBeVisible()
    await expect(studioLink).toHaveAttribute("href", "/studio")

    const playgroundLink = page.locator('section a[href="/playground"]')
    await expect(playgroundLink).toBeVisible()
  })
})

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe("Navigation", () => {
  test("nav bar is visible with all links", async ({ page }) => {
    await page.goto("/")

    const nav = page.locator("nav")
    await expect(nav.getByRole("link", { name: "PersonaSync" })).toBeVisible()
    await expect(nav.getByRole("link", { name: "Studio", exact: true })).toBeVisible()
    await expect(nav.getByRole("link", { name: "Playground", exact: true })).toBeVisible()
    await expect(nav.getByRole("link", { name: "Motion Lab", exact: true })).toBeVisible()
  })

  test("navigates to Studio page", async ({ page }) => {
    await page.goto("/")
    await page.locator("nav").getByRole("link", { name: "Studio", exact: true }).click()
    await page.waitForURL("/studio")
    await expect(page.getByText("Your Personas")).toBeVisible()
  })

  test("navigates to Playground page", async ({ page }) => {
    await page.goto("/")
    await page.locator("nav").getByRole("link", { name: "Playground", exact: true }).click()
    await page.waitForURL("/playground")
  })

  test("navigates to Motion Lab page", async ({ page }) => {
    await page.goto("/")
    await page.locator("nav").getByRole("link", { name: "Motion Lab", exact: true }).click()
    await page.waitForURL("/motion-lab")
    await expect(page.getByRole("heading", { name: "Motion Lab" })).toBeVisible()
  })

  test("home logo navigates back to /", async ({ page }) => {
    await page.goto("/studio")
    await page.locator("nav").getByRole("link", { name: "PersonaSync" }).click()
    await page.waitForURL("/")
  })
})

// ─── Studio ──────────────────────────────────────────────────────────────────

test.describe("Studio", () => {
  test("shows empty state when no personas exist", async ({ page }) => {
    await page.goto("/studio")
    // Wait for loading to finish
    await expect(page.getByText("Loading personas")).toBeHidden({ timeout: 10_000 })

    // Either we see personas or the empty state
    const body = await page.textContent("body")
    if (body?.includes("No personas yet")) {
      await expect(page.getByText("No personas yet")).toBeVisible()
      await expect(page.getByText("Create your first one")).toBeVisible()
    }

    // "New Persona" button is always visible
    await expect(page.getByRole("button", { name: /New Persona/i })).toBeVisible()
  })
})

// ─── Personas API ────────────────────────────────────────────────────────────

test.describe("Personas API", () => {
  test("GET /api/personas returns list", async ({ request }) => {
    const res = await request.get("/api/personas")
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty("personas")
    expect(Array.isArray(data.personas)).toBe(true)
  })

  test("POST /api/personas creates a persona", async ({ request }) => {
    const res = await request.post("/api/personas", {
      data: { name: "E2E Test Persona" },
    })
    expect(res.status()).toBe(201)
    const data = await res.json()
    expect(data.name).toBe("E2E Test Persona")
    expect(data.id).toBeTruthy()
    expect(data.status).toBe("draft")
  })

  test("GET /api/personas/:id returns the persona", async ({ request }) => {
    const create = await request.post("/api/personas", {
      data: { name: "E2E Fetch Test" },
    })
    const { id } = await create.json()

    const res = await request.get(`/api/personas/${id}`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.name).toBe("E2E Fetch Test")
    expect(data.trait_inputs).toBeTruthy()
  })

  test("PATCH /api/personas/:id updates name", async ({ request }) => {
    const create = await request.post("/api/personas", {
      data: { name: "Before Rename" },
    })
    const { id } = await create.json()

    const res = await request.patch(`/api/personas/${id}`, {
      data: { name: "After Rename" },
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.name).toBe("After Rename")
  })

  test("PATCH /api/personas/:id updates trait_inputs", async ({ request }) => {
    const create = await request.post("/api/personas", {
      data: { name: "Trait Update Test" },
    })
    const { id } = await create.json()

    const traits = { age_range: "20s", gender: "female", ethnicity: "East Asian" }
    const res = await request.patch(`/api/personas/${id}`, {
      data: { trait_inputs: traits },
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.trait_inputs).toMatchObject(traits)
  })

  test("DELETE /api/personas/:id removes the persona", async ({ request }) => {
    const create = await request.post("/api/personas", {
      data: { name: "To Delete" },
    })
    const { id } = await create.json()

    const res = await request.delete(`/api/personas/${id}`)
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.deleted).toBe(true)

    // Verify 404
    const verify = await request.get(`/api/personas/${id}`)
    expect(verify.status()).toBe(404)
  })

  test("POST /api/personas rejects empty name", async ({ request }) => {
    const res = await request.post("/api/personas", {
      data: { name: "" },
    })
    expect(res.status()).toBe(400)
  })

  test("PATCH with invalid id returns 404", async ({ request }) => {
    const res = await request.patch("/api/personas/00000000-0000-0000-0000-000000000000", {
      data: { name: "Ghost" },
    })
    expect(res.status()).toBe(404)
  })
})

// ─── Full UI Flow: Create → Edit → Back ─────────────────────────────────────

test.describe("Full Persona Flow (UI)", () => {
  test("create persona, land on editor, navigate back to gallery", async ({ page }) => {
    // 1. Go to studio
    await page.goto("/studio")
    await expect(page.getByText("Loading personas")).toBeHidden({ timeout: 10_000 })

    // 2. Click "New Persona" → browser prompt → type name
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("prompt")
      await dialog.accept("Playwright Hero")
    })
    await page.getByRole("button", { name: /New Persona/i }).click()

    // 3. Wait for gallery to refresh and show the new card
    await expect(page.getByText("Playwright Hero")).toBeVisible({ timeout: 10_000 })

    // 4. Click the card to go to the editor
    await page.getByText("Playwright Hero").click()
    await page.waitForURL(/\/studio\/.+/)

    // 5. Verify we're on the editor page
    const nameInput = page.locator('input[placeholder="Persona Name"]')
    await expect(nameInput).toHaveValue("Playwright Hero", { timeout: 10_000 })

    // 6. Verify editor layout elements
    await expect(page.getByText("Character Traits")).toBeVisible()
    await expect(page.getByRole("button", { name: /Save Draft/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /Save Persona/i })).toBeVisible()

    // 7. Edit the name
    await nameInput.fill("Playwright Hero Renamed")
    await page.getByRole("button", { name: /Save Draft/i }).click()

    // Short wait for save
    await page.waitForTimeout(1000)

    // 8. Navigate back
    await page.getByText("← Back").click()
    await page.waitForURL("/studio")
    await expect(page.getByText("Playwright Hero Renamed")).toBeVisible({ timeout: 10_000 })
  })
})

// ─── Playground Page ─────────────────────────────────────────────────────────

test.describe("Playground Page", () => {
  test("renders sidebar and chat area", async ({ page }) => {
    await page.goto("/playground")

    const sidebar = page.locator("aside")
    await expect(sidebar).toBeVisible()

    const main = page.locator("aside + div")
    await expect(main).toBeVisible()
  })
})

// ─── Motion Lab Page ─────────────────────────────────────────────────────────

test.describe("Motion Lab Page", () => {
  test("renders heading and upload zone", async ({ page }) => {
    await page.goto("/motion-lab")

    await expect(page.getByRole("heading", { name: "Motion Lab" })).toBeVisible()
    await expect(
      page.getByText("Upload a reference video")
    ).toBeVisible()

    // Upload zone is visible
    await expect(
      page.getByText(/Select a persona from the sidebar first|Drag & drop/)
    ).toBeVisible()
  })
})
