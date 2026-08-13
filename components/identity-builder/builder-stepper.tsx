"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getStepsForMode } from "@/lib/builder-steps"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { useIdentity } from "@/components/identity-builder/identity-context"

import { StepType } from "@/components/identity-builder/steps/step-type"
import { StepPhoto } from "@/components/identity-builder/steps/step-photo"
import { StepFrame } from "@/components/identity-builder/steps/step-frame"
import { StepEffects } from "@/components/identity-builder/steps/step-effects"
import { StepBadges } from "@/components/identity-builder/steps/step-badges"
import { StepClass } from "@/components/identity-builder/steps/step-class"
import { StepTitle } from "@/components/identity-builder/steps/step-title"
import { StepSignature } from "@/components/identity-builder/steps/step-signature"

const STEP_COMPONENT_MAP: Record<string, React.ComponentType> = {
  type: StepType,
  photo: StepPhoto,
  frame: StepFrame,
  effects: StepEffects,
  badges: StepBadges,
  class: StepClass,
  title: StepTitle,
  signature: StepSignature,
}

export function BuilderStepper() {
  const [stepIndex, setStepIndex] = useState(0)
  const { palette } = useGoaTimeContext()
  const { state } = useIdentity()

  const steps = getStepsForMode(state.generateMode)

  // Reset step index when mode changes to avoid out-of-bounds
  useEffect(() => {
    setStepIndex(0)
  }, [state.generateMode])

  const total = steps.length
  const current = steps[stepIndex]
  const StepComponent = current ? STEP_COMPONENT_MAP[current.id] : null
  const progressPct = ((stepIndex + 1) / total) * 100

  const goNext = () => setStepIndex((i) => Math.min(total - 1, i + 1))
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))
  const goTo = (i: number) => setStepIndex(i)

  if (!StepComponent) return null

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Step indicator rail */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Step {stepIndex + 1} of {total}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{current.label}</span>
        </div>
        <Progress value={progressPct}>
          <ProgressTrack className="h-1.5 bg-muted">
            <ProgressIndicator style={{ backgroundColor: palette.accent }} />
          </ProgressTrack>
        </Progress>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {steps.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                i === stepIndex
                  ? "border-transparent text-white"
                  : i < stepIndex
                    ? "border-border bg-muted text-foreground"
                    : "border-border/60 bg-transparent text-muted-foreground hover:bg-muted"
              )}
              style={i === stepIndex ? { backgroundColor: palette.accent } : undefined}
            >
              {i < stepIndex ? <Check className="size-3" /> : null}
              {step.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Active step panel */}
      <div className="min-h-[320px] rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <StepComponent />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        {stepIndex < total - 1 ? (
          <Button onClick={goNext} style={{ backgroundColor: palette.accent, color: "white" }}>
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">Your {state.generateMode === "pfp" ? "PFP" : "Builder ID"} is ready below ↓</span>
        )}
      </div>
    </div>
  )
}
