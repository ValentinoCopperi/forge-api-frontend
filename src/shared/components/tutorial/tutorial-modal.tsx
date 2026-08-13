import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  FolderKanban,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog"
import { cn } from "@/shared/utils/utils"

export type TutorialStep = {
  title: string
  description: string
  icon: LucideIcon
}

const DEFAULT_STEPS: TutorialStep[] = [
  {
    icon: Sparkles,
    title: "Welcome to Forge",
    description:
      "A quick tour to help you get oriented. You can revisit this anytime from settings.",
  },
  {
    icon: Building2,
    title: "Your organizations",
    description:
      "Manage every workspace from one place. Switch between teams and keep context clear.",
  },
  {
    icon: UsersRound,
    title: "Members and roles",
    description:
      "Invite collaborators, assign roles, and see who has access to each project.",
  },
  {
    icon: FolderKanban,
    title: "Projects at a glance",
    description:
      "Track active work, recent updates, and organization insights from your dashboard.",
  },
]

type TutorialModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps?: TutorialStep[]
  onComplete?: () => void
}

export function TutorialModal({
  open,
  onOpenChange,
  steps = DEFAULT_STEPS,
  onComplete,
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const step = steps[currentStep]
  const StepIcon = step.icon
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCurrentStep(0)
    }

    onOpenChange(nextOpen)
  }

  const handleComplete = () => {
    setCurrentStep(0)
    onComplete?.()
    onOpenChange(false)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
      return
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden p-0 sm:max-w-xl"
      >
        <div className="border-b border-border px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Quick tour
              </p>
              <DialogTitle className="mt-2 text-xl font-semibold tracking-tight">
                Get started in a few steps
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-md text-sm leading-6">
                Explore the essentials before diving into your dashboard.
              </DialogDescription>
            </div>
            <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 px-6 py-5 md:grid-cols-[11rem_minmax(0,1fr)]">
          <ol className="hidden space-y-2 md:block">
            {steps.map((item, index) => {
              const Icon = item.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-foreground shadow-sm"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-xl border",
                        isActive || isCompleted
                          ? "border-primary/20 bg-primary/15 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="size-4" />
                      ) : (
                        <Icon className="size-4" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium">
                        Step {index + 1}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {item.title}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="flex min-h-56 flex-col">
            <div className="flex flex-1 flex-col justify-center">
              <div
                key={currentStep}
                className="animate-in fade-in-0 slide-in-from-right-4 duration-300"
              >
                <div className="mb-5 inline-flex size-14 items-center justify-center rounded-[1.25rem] border border-primary/20 bg-primary/10 text-primary shadow-sm">
                  <StepIcon className="size-7" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 md:hidden">
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    index <= currentStep ? "bg-primary" : "bg-primary/15"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground"
            onClick={handleSkip}
          >
            Skip tour
          </Button>

          <div className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isFirstStep}
              onClick={handleBack}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button type="button" onClick={handleNext}>
              {isLastStep ? "Finish" : "Next"}
              {isLastStep ? (
                <Check className="size-4" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
