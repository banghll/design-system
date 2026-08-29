/* 갤러리 공통 껍데기.
 * data-kit 은 Paper 추출기가 잡는 표시다 — 갤러리와 추출 지그를 겸한다. */
"use client"

export function Kit({
  id,
  note,
  children,
}: {
  id: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-baseline gap-3">
        <code className="text-caption-2xs text-subtle">{id}</code>
        {note ? (
          <span className="text-caption-2xs text-subtle opacity-70">{note}</span>
        ) : null}
      </div>
      <div
        data-kit={id}
        className="flex flex-wrap items-start gap-4 rounded-lg border p-5"
        style={{
          borderColor: "var(--color-border-faint)",
          background: "var(--color-card)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Group({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-16">
      <div
        className="mb-6 border-t pt-8"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="text-heading-md">{title}</h2>
        <p className="text-body-sm text-subtle mt-1">{note}</p>
      </div>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  )
}
