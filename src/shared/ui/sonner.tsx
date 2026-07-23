import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"
import { cn } from "@/shared/utils/utils"

const toasterClassNames = {
  toast: cn(
    "group toast overflow-hidden rounded-3xl border border-border bg-card font-sans text-card-foreground shadow-sm",
    "backdrop-blur supports-backdrop-filter:bg-card/95",
    "[&_[data-description]]:mt-1 [&_[data-description]]:text-sm [&_[data-description]]:font-normal [&_[data-description]]:leading-6 [&_[data-description]]:tracking-normal [&_[data-description]]:text-secondary-foreground [&_[data-description]]:!opacity-100",
  ),
  title: "text-sm font-semibold leading-snug tracking-tight text-foreground",
  description:
    "mt-1 text-sm font-normal leading-6 tracking-normal text-secondary-foreground !opacity-100",
  actionButton: "rounded-xl bg-primary text-primary-foreground",
  cancelButton: "rounded-xl bg-muted text-muted-foreground",
  closeButton: "rounded-lg border-border bg-background text-foreground",
  success: "[&_[data-icon]]:text-primary",
  error: "[&_[data-icon]]:text-destructive",
  warning: "[&_[data-icon]]:text-amber-500",
  info: "[&_[data-icon]]:text-primary",
} satisfies NonNullable<ToasterProps["toastOptions"]>["classNames"]

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors={false}
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1.5rem",
          "--success-bg": "var(--card)",
          "--error-bg": "var(--card)",
          "--warning-bg": "var(--card)",
          "--info-bg": "var(--card)",
        } as React.CSSProperties
      }
      toastOptions={{ classNames: toasterClassNames }}
      {...props}
    />
  )
}

export { Toaster }
