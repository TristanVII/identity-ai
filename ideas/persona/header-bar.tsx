"use client"

import { ChevronRight, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderBarProps {
  personaName: string
  onNameChange: (name: string) => void
  hasChanges: boolean
  canFinalize: boolean
  onFinalize: () => void
}

export function HeaderBar({
  personaName,
  onNameChange,
  hasChanges,
  canFinalize,
  onFinalize,
}: HeaderBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface-elevated px-4 lg:px-6">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Workspace</span>
        <ChevronRight className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">Personas</span>
        <ChevronRight className="size-4 text-muted-foreground" />
        <span className="font-medium text-foreground">Create New Persona</span>
      </div>
      
      {/* Center: Name Input - Desktop */}
      <div className="hidden items-center gap-3 md:flex">
        <Input
          type="text"
          placeholder="Name your Persona (e.g., Mia - Fitness Model)"
          value={personaName}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-72 border-border bg-input text-foreground placeholder:text-muted-foreground lg:w-96"
        />
        
        {/* Status Indicator */}
        <Badge
          variant="outline"
          className={hasChanges 
            ? "border-amber-500/50 bg-amber-500/10 text-amber-400" 
            : "border-border text-muted-foreground"
          }
        >
          {hasChanges ? "Unsaved Changes" : "Draft"}
        </Badge>
      </div>
      
      {/* Mobile Name Input - shows below header */}
      <div className="absolute left-0 top-full z-10 flex w-full items-center gap-2 border-b border-border bg-surface-elevated p-3 md:hidden">
        <Input
          type="text"
          placeholder="Name your Persona..."
          value={personaName}
          onChange={(e) => onNameChange(e.target.value)}
          className="flex-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
        <Badge
          variant="outline"
          className={hasChanges 
            ? "shrink-0 border-amber-500/50 bg-amber-500/10 text-amber-400" 
            : "shrink-0 border-border text-muted-foreground"
          }
        >
          {hasChanges ? "Unsaved" : "Draft"}
        </Badge>
      </div>
      
      {/* Right: Finalize Button */}
      <Button
        onClick={onFinalize}
        disabled={!canFinalize}
        className="gap-2 bg-primary text-primary-foreground shadow-[0_0_20px_rgba(134,239,172,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(134,239,172,0.4)] disabled:opacity-50 disabled:shadow-none"
      >
        <Sparkles className="size-4" />
        <span className="hidden sm:inline">Create & Finalize Persona</span>
        <span className="sm:hidden">Finalize</span>
      </Button>
    </header>
  )
}
