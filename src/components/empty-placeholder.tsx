import { Key } from "lucide-react"

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
children: React.ReactNode;
}

export function EmptyPlaceholder({
className,
children,
...props
}: EmptyPlaceholderProps) {
return (
    <div
    className={`flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50 ${className || ''}`}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  name: string
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  const Icon = name === "key" ? Key : Key // Add more icons as needed

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className="h-10 w-10" {...props} />
    </div>
  )
}

interface EmptyPlaceholderTitleProps
extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
className,
...props
}: EmptyPlaceholderTitleProps) {
return (
    <h2 className={`mt-6 text-xl font-semibold ${className || ''}`} {...props} />
  )
}

interface EmptyPlaceholderDescriptionProps
extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
className,
...props
}: EmptyPlaceholderDescriptionProps) {
return (
    <p
    className={`mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground ${className || ''}`}
      {...props}
    />
  )
}
