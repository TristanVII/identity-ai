import { execSync } from "child_process"
import type { FullConfig } from "@playwright/test"

const CONTAINER_NAME = "personasync-test-pg"

export default async function globalTeardown(_config: FullConfig) {
  console.log("\n🧹  Stopping test PostgreSQL container…")
  try {
    execSync(`docker rm -f ${CONTAINER_NAME}`, { stdio: "inherit" })
  } catch {
    // already removed
  }
}
