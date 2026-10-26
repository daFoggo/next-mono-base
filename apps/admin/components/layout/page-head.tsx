/** Title, optional standfirst and the page's primary action (A3). */
export function PageHead({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-3xl leading-tight font-normal tracking-tight text-foreground max-sm:text-2xl">
          {title}
        </h1>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="max-sm:hidden">{action}</div> : null}
    </div>
  )
}
