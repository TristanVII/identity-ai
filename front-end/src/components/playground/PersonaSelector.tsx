"use client"

import { usePersonas } from "@/lib/hooks/use-personas"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Body1,
  Caption1,
  makeStyles,
  tokens,
} from "@fluentui/react-components"

const useStyles = makeStyles({
  root: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalS}`,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  heading: {
    padding: `0 ${tokens.spacingHorizontalS}`,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: tokens.colorNeutralForeground3,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transitionProperty: "background-color",
    transitionDuration: tokens.durationNormal,
    backgroundColor: "transparent",
  },
  itemActive: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  thumb: {
    width: "32px",
    height: "32px",
    borderRadius: tokens.borderRadiusSmall,
    objectFit: "cover",
    flexShrink: 0,
  },
  thumbPlaceholder: {
    width: "32px",
    height: "32px",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
    flexShrink: 0,
  },
})

export function PersonaSelector() {
  const styles = useStyles()
  const { personas, isLoading } = usePersonas()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeId = searchParams.get("persona")

  const readyPersonas = personas.filter((p) => p.status === "ready")

  function select(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("persona", id)
    router.push(`?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <div className={styles.root}>
        <Caption1 style={{ color: tokens.colorNeutralForeground3, padding: tokens.spacingHorizontalS }}>
          Loading...
        </Caption1>
      </div>
    )
  }

  if (readyPersonas.length === 0) {
    return (
      <div className={styles.root}>
        <Caption1 style={{ color: tokens.colorNeutralForeground4, padding: tokens.spacingHorizontalS }}>
          No finalized personas yet. Create one in Studio.
        </Caption1>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Caption1 className={styles.heading} style={{ fontWeight: tokens.fontWeightSemibold }}>
        Personas
      </Caption1>
      <div className={styles.list}>
        {readyPersonas.map((p) => (
          <button
            key={p.id}
            onClick={() => select(p.id)}
            className={`${styles.item} ${activeId === p.id ? styles.itemActive : ""}`}
            onMouseEnter={(e) => {
              if (activeId !== p.id) e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground1Hover
            }}
            onMouseLeave={(e) => {
              if (activeId !== p.id) e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            {p.nine_grid_url ? (
              <img src={p.nine_grid_url} alt={p.name} className={styles.thumb} />
            ) : (
              <div className={styles.thumbPlaceholder} />
            )}
            <Body1 style={{
              color: activeId === p.id ? tokens.colorBrandForeground1 : tokens.colorNeutralForeground1,
              fontWeight: activeId === p.id ? tokens.fontWeightSemibold : tokens.fontWeightMedium,
            }}>
              {p.name}
            </Body1>
          </button>
        ))}
      </div>
    </div>
  )
}
