"use client"

import { Suspense } from "react"
import { Spinner, makeStyles, tokens } from "@fluentui/react-components"
import { PersonaSelector } from "@/components/playground/PersonaSelector"
import { EditorWorkspace } from "@/components/playground/EditorWorkspace"

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "calc(100dvh - 60px)",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  sidebar: {
    width: "220px",
    minWidth: "220px",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowY: "auto",
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacingVerticalXXL,
  },
})

export default function PlaygroundPage() {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <Suspense fallback={<div className={styles.loading}><Spinner size="small" /></div>}>
          <PersonaSelector />
        </Suspense>
      </aside>
      <Suspense fallback={<div className={styles.loading} style={{ flex: 1 }}><Spinner /></div>}>
        <EditorWorkspace />
      </Suspense>
    </div>
  )
}
