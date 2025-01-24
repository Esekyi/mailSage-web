interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({
  heading,
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
return (
<div className={`flex items-center justify-between ${className || ''}`} {...props}>
      <div>
        <h1 className="text-2xl font-bold">{heading}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
