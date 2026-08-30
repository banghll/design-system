// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
export default function StatsSection() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <p className="text-muted-foreground max-w-4xl text-balance text-4xl font-medium tracking-tight lg:text-5xl">
                    <span className="text-foreground">Scale with confidence.</span> Handle thousands of transactions per second.
                </p>

                <div className="mt-32 grid gap-12 md:grid-cols-3 xl:mt-44">
                    <div className="space-y-3 border-t pt-6">
                        <div className="text-5xl font-semibold tracking-tight">+21200</div>
                        <p className="text-muted-foreground">Stars on GitHub</p>
                    </div>
                    <div className="space-y-3 border-t pt-6">
                        <div className="text-5xl font-semibold tracking-tight">22 Million</div>
                        <p className="text-muted-foreground">Active Users</p>
                    </div>
                    <div className="space-y-3 border-t pt-6">
                        <div className="text-5xl font-semibold tracking-tight">+500</div>
                        <p className="text-muted-foreground">Powered Apps</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
