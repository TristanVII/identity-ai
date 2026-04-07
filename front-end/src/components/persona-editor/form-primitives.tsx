"use client"

import { useState, type ReactNode } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Field,
  Input,
  Select,
  Textarea,
  Tag,
  TagGroup,
  Divider,
  makeStyles,
  tokens,
  mergeClasses,
} from "@fluentui/react-components"
import { Add16Regular, Dismiss12Regular } from "@fluentui/react-icons"

// ── Styles ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  sectionPanel: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalS,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalM,
  },
  subHeading: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: tokens.spacingVerticalS,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  tagInputRow: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    alignItems: "flex-end",
  },
  tagAddBtn: {
    minWidth: "auto",
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    background: tokens.colorBrandBackground2,
    border: "none",
    borderRadius: tokens.borderRadiusMedium,
    "&:hover": {
      background: tokens.colorBrandBackground2Hover,
    },
  },
})

// ── Collapsible Section (Accordion wrapper) ──────────────────────────────────

interface SectionProps {
  id: string
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Section({ id, title, children, defaultOpen }: SectionProps) {
  const styles = useStyles()
  return (
    <Accordion collapsible defaultOpenItems={defaultOpen ? [id] : []}>
      <AccordionItem value={id}>
        <AccordionHeader size="large">{title}</AccordionHeader>
        <AccordionPanel>
          <div className={styles.sectionPanel}>{children}</div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

// ── Text field ───────────────────────────────────────────────────────────────

interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  multiline?: boolean
}

export function TextField({ label, value, onChange, placeholder, hint, multiline }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} size="small">
      {multiline ? (
        <Textarea
          value={value}
          onChange={(_, d) => onChange(d.value)}
          placeholder={placeholder}
          resize="vertical"
          size="small"
        />
      ) : (
        <Input
          value={value}
          onChange={(_, d) => onChange(d.value)}
          placeholder={placeholder}
          size="small"
          appearance="filled-darker"
        />
      )}
    </Field>
  )
}

// ── Select field ─────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  hint?: string
}

export function SelectField({ label, value, onChange, options, hint }: SelectFieldProps) {
  return (
    <Field label={label} hint={hint} size="small">
      <Select
        value={value}
        onChange={(_, d) => onChange(d.value)}
        size="small"
        appearance="filled-darker"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </Select>
    </Field>
  )
}

// ── Tag list (string array input) ────────────────────────────────────────────

interface TagFieldProps {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  hint?: string
}

export function TagField({ label, values, onChange, placeholder, hint }: TagFieldProps) {
  const styles = useStyles()
  const [input, setInput] = useState("")

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
      setInput("")
    }
  }

  return (
    <Field label={label} hint={hint} size="small">
      {values.length > 0 && (
        <TagGroup
          onDismiss={(_, d) => onChange(values.filter((_, i) => `tag-${i}` !== d.value))}
          className={styles.tagRow}
          size="small"
        >
          {values.map((v, i) => (
            <Tag
              key={i}
              value={`tag-${i}`}
              dismissible
              dismissIcon={<Dismiss12Regular />}
              shape="circular"
              size="small"
              appearance="brand"
            >
              {v}
            </Tag>
          ))}
        </TagGroup>
      )}
      <div className={styles.tagInputRow}>
        <Input
          value={input}
          onChange={(_, d) => setInput(d.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder={placeholder}
          size="small"
          appearance="filled-darker"
          style={{ flex: 1 }}
        />
        <button onClick={add} className={styles.tagAddBtn}>
          <Add16Regular /> Add
        </button>
      </div>
    </Field>
  )
}

// ── Two-column grid ──────────────────────────────────────────────────────────

export function FieldGrid({ children }: { children: ReactNode }) {
  const styles = useStyles()
  return <div className={styles.fieldGrid}>{children}</div>
}

// ── Sub-section label ────────────────────────────────────────────────────────

export function SubHeading({ children }: { children: ReactNode }) {
  const styles = useStyles()
  return (
    <>
      <Divider appearance="subtle" />
      <span className={styles.subHeading}>{children}</span>
    </>
  )
}
