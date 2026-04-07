"use client"

import {
  Button,
  Caption1,
  Divider,
  Dropdown,
  Label,
  Option,
  Subtitle2,
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components"
import {
  Delete16Regular,
} from "@fluentui/react-icons"

const useStyles = makeStyles({
  root: {
    width: "260px",
    minWidth: "260px",
    display: "flex",
    flexDirection: "column",
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    height: "100%",
    overflow: "hidden",
  },
  section: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: tokens.colorNeutralForeground3,
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
  },
  fieldLabel: {
    flexShrink: 0,
  },
  fieldDropdown: {
    minWidth: "100px",
  },
  historyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL} 0`,
  },
  historyList: {
    flex: 1,
    overflowY: "auto",
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    textAlign: "left",
    transitionProperty: "background-color",
    transitionDuration: tokens.durationNormal,
  },
  historyThumb: {
    width: "32px",
    height: "32px",
    borderRadius: tokens.borderRadiusSmall,
    objectFit: "cover",
    flexShrink: 0,
  },
  historyMeta: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  historyPrompt: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  emptyHistory: {
    textAlign: "center",
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalM}`,
    color: tokens.colorNeutralForeground4,
  },
})

const ASPECT_RATIOS = ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"]
const RESOLUTIONS = ["512", "1K", "2K", "4K"]

export interface EditHistoryItem {
  id: string
  prompt: string
  imageUrl: string
  timestamp: number
}

interface SettingsPanelProps {
  aspectRatio: string
  imageSize: string
  onAspectRatioChange: (v: string) => void
  onImageSizeChange: (v: string) => void
  history: EditHistoryItem[]
  onHistorySelect: (item: EditHistoryItem) => void
  onHistoryClear: () => void
}

export function SettingsPanel({
  aspectRatio,
  imageSize,
  onAspectRatioChange,
  onImageSizeChange,
  history,
  onHistorySelect,
  onHistoryClear,
}: SettingsPanelProps) {
  const styles = useStyles()

  return (
    <aside className={styles.root}>
      <div className={styles.section}>
        <Caption1 className={styles.sectionLabel} style={{ fontWeight: tokens.fontWeightSemibold }}>
          Output
        </Caption1>

        <div className={styles.fieldRow}>
          <Label size="small" className={styles.fieldLabel}>Ratio</Label>
          <Dropdown
            className={styles.fieldDropdown}
            size="small"
            value={aspectRatio}
            selectedOptions={[aspectRatio]}
            onOptionSelect={(_, data) => {
              if (data.optionValue) onAspectRatioChange(data.optionValue)
            }}
          >
            {ASPECT_RATIOS.map((r) => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Dropdown>
        </div>

        <div className={styles.fieldRow}>
          <Label size="small" className={styles.fieldLabel}>Size</Label>
          <Dropdown
            className={styles.fieldDropdown}
            size="small"
            value={imageSize}
            selectedOptions={[imageSize]}
            onOptionSelect={(_, data) => {
              if (data.optionValue) onImageSizeChange(data.optionValue)
            }}
          >
            {RESOLUTIONS.map((r) => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Dropdown>
        </div>
      </div>

      <Divider />

      <div className={styles.historyHeader}>
        <Caption1 className={styles.sectionLabel} style={{ fontWeight: tokens.fontWeightSemibold }}>
          History
        </Caption1>
        {history.length > 0 && (
          <Tooltip content="Clear history" relationship="label">
            <Button
              appearance="subtle"
              size="small"
              icon={<Delete16Regular />}
              onClick={onHistoryClear}
              style={{ minWidth: 24, width: 24, height: 24, padding: 0 }}
            />
          </Tooltip>
        )}
      </div>

      <div className={styles.historyList}>
        {history.length === 0 && (
          <Caption1 className={styles.emptyHistory}>
            Generated images will appear here
          </Caption1>
        )}
        {history.map((item, i) => (
          <button
            key={item.id}
            className={styles.historyItem}
            onClick={() => onHistorySelect(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground1Hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            <img src={item.imageUrl} alt="" className={styles.historyThumb} />
            <div className={styles.historyMeta}>
              <Caption1 className={styles.historyPrompt} style={{ fontWeight: tokens.fontWeightMedium }}>
                {item.prompt}
              </Caption1>
              <Caption1 style={{ color: tokens.colorNeutralForeground4, fontSize: tokens.fontSizeBase100 }}>
                {history.length - i}
              </Caption1>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
