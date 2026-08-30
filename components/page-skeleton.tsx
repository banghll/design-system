/* 이동 중에 보여 줄 뼈대.
 *
 * 카탈로그 페이지는 한 화면에 컴포넌트가 수백 개라 첫 렌더가 늦다.
 * 아무것도 없는 흰 화면을 두면 눌린 건지 아닌지 알 수 없으므로,
 * 들어갈 자리의 모양만 먼저 그린다. 사이드바는 그대로 남겨 위치 감각을 유지한다. */
import { CatalogShell } from "@/components/catalog-shell"
import { Skeleton } from "@/components/ui/skeleton"

/* 카탈로그 본문 — 셸은 살리고 내용만 뼈대로. */
export function CatalogSkeleton() {
  return (
    <CatalogShell>
      <div className="mx-auto max-w-6xl px-8 py-14">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-full max-w-[60ch]" />
        <Skeleton className="mt-2 h-5 w-full max-w-[48ch]" />

        <div className="mt-16 flex flex-col gap-14">
          {[0, 1].map((s) => (
            <section key={s}>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-72" />
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-52 w-full rounded-xl" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </CatalogShell>
  )
}

/* 블록 상세 — 화면 전체가 한 벌이라 셸을 두르지 않는다. */
export function FullScreenSkeleton() {
  return (
    <div className="flex min-h-dvh">
      <div className="bg-sidebar hidden w-64 shrink-0 flex-col gap-2 p-3 lg:flex">
        <Skeleton className="mb-3 h-8 w-full" />
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-7 w-full" />
        ))}
      </div>
      <div className="min-w-0 flex-1 p-4">
        <Skeleton className="h-12 w-full" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-4 h-96 w-full rounded-xl" />
      </div>
    </div>
  )
}
