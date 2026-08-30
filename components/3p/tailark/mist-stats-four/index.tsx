// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
export default function StatsSection() {
    return (
        <section>
            <div className="py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="sr-only">Tailark in stats</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="space-y-0.5 md:text-center">
                            <div className="text-primary text-4xl font-bold">90+</div>
                            <p className="text-muted-foreground">Integrations</p>
                        </div>
                        <div className="space-y-0.5 md:text-center">
                            <div className="text-primary text-4xl font-bold">56%</div>
                            <p className="text-muted-foreground">Productivity Boost</p>
                        </div>
                        <div className="col-span-2 border-t pt-4 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                            <p className="text-muted-foreground text-balance text-lg">Our platform continues to grow with developers and businesses using productivity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
