"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Sparkles, Image, Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface FinalizationModalProps {
  isOpen: boolean
  onClose: () => void
  personaName: string
}

type FinalizationStep = "compiling" | "shooting" | "complete"

const steps = [
  { id: "compiling", label: "Compiling DNA...", icon: Database },
  { id: "shooting", label: "Shooting the Lookbook...", icon: Image },
  { id: "complete", label: "Complete!", icon: CheckCircle2 },
]

export function FinalizationModal({
  isOpen,
  onClose,
  personaName,
}: FinalizationModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FinalizationStep>("compiling")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("compiling")
      setProgress(0)
      return
    }

    // Simulate the finalization process
    const stepDurations = {
      compiling: 2000,
      shooting: 3000,
    }

    let progressInterval: NodeJS.Timeout
    let stepTimeout: NodeJS.Timeout

    const runStep = (step: FinalizationStep, startProgress: number, endProgress: number) => {
      const duration = stepDurations[step as keyof typeof stepDurations] || 1000
      const increment = (endProgress - startProgress) / (duration / 50)
      let currentProgress = startProgress

      progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + increment, endProgress)
        setProgress(currentProgress)
      }, 50)

      return duration
    }

    // Step 1: Compiling DNA
    setCurrentStep("compiling")
    const compilingDuration = runStep("compiling", 0, 40)

    stepTimeout = setTimeout(() => {
      clearInterval(progressInterval)
      setCurrentStep("shooting")
      
      // Step 2: Shooting the Lookbook
      const shootingDuration = runStep("shooting", 40, 95)
      
      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(100)
        setCurrentStep("complete")
      }, shootingDuration)
    }, compilingDuration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(stepTimeout)
    }
  }, [isOpen])

  const handleContinue = () => {
    // In a real app, this would redirect to the chat playground
    onClose()
  }

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === currentStep)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && currentStep === "complete" && onClose()}>
      <DialogContent 
        showCloseButton={currentStep === "complete"}
        className="border-border bg-card sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {currentStep === "complete" ? (
              <>
                <CheckCircle2 className="size-5 text-primary" />
                Persona Ready!
              </>
            ) : (
              <>
                <Sparkles className="size-5 animate-pulse text-primary" />
                Finalizing Your Persona
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {currentStep !== "complete" && (
            <p className="text-center text-sm text-muted-foreground">
              Please do not close this window.
            </p>
          )}

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isComplete = getCurrentStepIndex() > index
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 transition-opacity ${
                    isActive || isComplete ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded-full border ${
                      isComplete
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border bg-surface-elevated text-muted-foreground"
                    }`}
                  >
                    <StepIcon className="size-4" />
                  </div>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "font-medium text-foreground"
                        : isComplete
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && currentStep !== "complete" && (
                    <div className="ml-auto">
                      <div className="size-2 animate-pulse rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Success State */}
          {currentStep === "complete" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle2 className="size-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {personaName || "Your Persona"} is now ready for shoots!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Head to the Chat Playground to start creating content.
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="w-full gap-2 bg-primary text-primary-foreground"
              >
                <Sparkles className="size-4" />
                Start Creating
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
