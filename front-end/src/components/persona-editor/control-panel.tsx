"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Caption1,
  Divider,
  Subtitle2,
  Body1,
  Switch,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  ChevronDown16Regular,
  ChevronUp16Regular,
  ArrowRight16Regular,
  ArrowLeft16Regular,
} from "@fluentui/react-icons"
import type { CharacterBlueprint } from "@/types/character-blueprint"
import { MetadataSection } from "./sections/metadata-section"
import { FacialAnatomySection } from "./sections/facial-anatomy-section"
import { FacialFeaturesSection } from "./sections/facial-features-section"
import { HairSection } from "./sections/hair-section"
import { BodySection } from "./sections/body-section"
import { ExpressionSection, CosmeticsSection, StylingSection, ModificationsSection, AnchorsSection } from "./sections/extras-sections"
import { MultiImageUploader } from "./multi-image-uploader"

const useStyles = makeStyles({
  aside: {
    width: "100%",
    maxWidth: "480px",
    minWidth: "380px",
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    height: "100%",
    overflow: "hidden",
  },
  stepBar: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  stepIndicator: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    flexShrink: 0,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  stepDone: {
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground2,
  },
  stepConnector: {
    width: "20px",
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: tokens.spacingHorizontalM,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  stepContent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalXS,
  },
  stepFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  toggleCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expandHint: {
    width: "100%",
    marginTop: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalXS,
    transitionProperty: "border-color, color",
    transitionDuration: tokens.durationNormal,
  },
})

interface ControlPanelProps {
  personaId: string
  blueprint: CharacterBlueprint
  onChange: (b: CharacterBlueprint) => void
  onAnalyzed: (blueprint: Record<string, unknown>, sourceImageUrls: string[]) => void
  hasAnalyzed: boolean
  isEditMode?: boolean
}

export function ControlPanel({ personaId, blueprint, onChange, onAnalyzed, hasAnalyzed, isEditMode }: ControlPanelProps) {
  const styles = useStyles()
  const [step, setStep] = useState<1 | 2>(hasAnalyzed || isEditMode ? 2 : 1)
  const [showAdvanced, setShowAdvanced] = useState(hasAnalyzed || isEditMode)

  // When isEditMode activates after data loads, force step 2
  useEffect(() => {
    if (isEditMode) {
      setStep(2)
      setShowAdvanced(true)
    }
  }, [isEditMode])

  const set = <K extends keyof CharacterBlueprint>(k: K, v: CharacterBlueprint[K]) =>
    onChange({ ...blueprint, [k]: v })

  const handleAnalyzedAndAdvance = (bp: Record<string, unknown>, urls: string[]) => {
    onAnalyzed(bp, urls)
    setShowAdvanced(true)
    setStep(2)
  }

  return (
    <aside className={styles.aside}>
      {/* Step indicators — hidden in edit mode (only blueprint shown) */}
      {!isEditMode && (
        <div className={styles.stepBar}>
          <div
            className={`${styles.stepIndicator} ${step === 1 ? styles.stepActive : styles.stepDone}`}
            style={{ cursor: "pointer" }}
            onClick={() => setStep(1)}
          >
            1
          </div>
          <Caption1 style={{ cursor: "pointer", color: step === 1 ? tokens.colorNeutralForeground1 : tokens.colorNeutralForeground3 }} onClick={() => setStep(1)}>
            References
          </Caption1>
          <div className={styles.stepConnector} />
          <div
            className={`${styles.stepIndicator} ${step === 2 ? styles.stepActive : styles.stepDone}`}
            style={{ cursor: "pointer" }}
            onClick={() => setStep(2)}
          >
            2
          </div>
          <Caption1 style={{ cursor: "pointer", color: step === 2 ? tokens.colorNeutralForeground1 : tokens.colorNeutralForeground3 }} onClick={() => setStep(2)}>
            Blueprint
          </Caption1>
        </div>
      )}

      {/* Scrollable content */}
      <div className={styles.scrollArea}>
        {step === 1 && !isEditMode && (
          <div className={styles.stepContent}>
            <Subtitle2>Reference Photos</Subtitle2>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
              Upload reference photos and let AI extract the full character blueprint. You can skip this step and fill in details manually.
            </Caption1>
            <MultiImageUploader personaId={personaId} onAnalyzed={handleAnalyzedAndAdvance} />
          </div>
        )}

        {step === 2 && (
          <>
            <MetadataSection data={blueprint.character_metadata} onChange={(d) => set("character_metadata", d)} />
            <AnchorsSection data={blueprint.character_consistency_anchors} onChange={(d) => set("character_consistency_anchors", d)} />

            <div className={styles.toggleCard}>
              <div className={styles.toggleRow}>
                <Subtitle2>Deep Granularity Engine</Subtitle2>
                <Switch
                  checked={showAdvanced}
                  onChange={(_, d) => setShowAdvanced(d.checked)}
                  label={showAdvanced ? "On" : "Off"}
                  labelPosition="before"
                />
              </div>
              {!showAdvanced && (
                <button className={styles.expandHint} onClick={() => setShowAdvanced(true)}>
                  <ChevronDown16Regular />
                  10 sections, 100+ detailed fields
                </button>
              )}
            </div>

            {showAdvanced && (
              <>
                <FacialAnatomySection data={blueprint.facial_anatomy} onChange={(d) => set("facial_anatomy", d)} />
                <FacialFeaturesSection data={blueprint.facial_features} onChange={(d) => set("facial_features", d)} />
                <HairSection data={blueprint.hair_and_pilosity} onChange={(d) => set("hair_and_pilosity", d)} />
                <BodySection
                  torso={blueprint.torso_and_upper_body}
                  limbs={blueprint.upper_limbs_and_hands}
                  onChangeTorso={(d) => set("torso_and_upper_body", d)}
                  onChangeLimbs={(d) => set("upper_limbs_and_hands", d)}
                />
                <ExpressionSection data={blueprint.expression_and_body_language} onChange={(d) => set("expression_and_body_language", d)} />
                <CosmeticsSection data={blueprint.cosmetics_and_grooming} onChange={(d) => set("cosmetics_and_grooming", d)} />
                <StylingSection data={blueprint.upper_body_styling} onChange={(d) => set("upper_body_styling", d)} />
                <ModificationsSection data={blueprint.body_modifications} onChange={(d) => set("body_modifications", d)} />

                <Divider />
                <div style={{ textAlign: "center", padding: `${tokens.spacingVerticalS} 0` }}>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<ChevronUp16Regular />}
                    onClick={() => setShowAdvanced(false)}
                  >
                    Collapse Advanced
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer navigation */}
      {!isEditMode && (
        <div className={styles.stepFooter}>
          {step === 1 ? (
            <>
              <div />
              <div style={{ display: "flex", gap: tokens.spacingHorizontalS }}>
                <Button appearance="subtle" size="small" onClick={() => setStep(2)}>
                  Skip
                </Button>
                <Button
                  appearance="primary"
                  size="small"
                  icon={<ArrowRight16Regular />}
                  iconPosition="after"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                appearance="subtle"
                size="small"
                icon={<ArrowLeft16Regular />}
                onClick={() => setStep(1)}
              >
                References
              </Button>
              <Body1 style={{ color: tokens.colorNeutralForeground3 }}>
                Step 2 of 2
              </Body1>
            </>
          )}
        </div>
      )}
    </aside>
  )
}
