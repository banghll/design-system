// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
export default function StatsSection() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-4xl font-semibold lg:text-5xl">Tailark in numbers</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Our platform continues to grow with developers and businesses using our tools to create innovative solutions and enhance productivity.</p>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4">
                        <div>
                            <div className="text-foreground text-4xl font-bold">90+</div>
                            <p className="text-muted-foreground">Integrations</p>
                        </div>
                        <div>
                            <div className="text-foreground text-4xl font-bold">56%</div>
                            <p className="text-muted-foreground">Productivity Boost</p>
                        </div>
                        <div>
                            <div className="text-foreground text-4xl font-bold">24/7</div>
                            <p className="text-muted-foreground">Customer Support</p>
                        </div>
                        <div>
                            <div className="text-foreground text-4xl font-bold">10k+</div>
                            <p className="text-muted-foreground">Active Users</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
