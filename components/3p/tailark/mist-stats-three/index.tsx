// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { ArrowRight } from 'lucide-react'

export default function StatsSection() {
    return (
        <section>
            <div className="py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Tailark in numbers</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Our platform continues to grow with developers and businesses using our tools to create innovative solutions and enhance productivity.</p>
                    </div>
                    <ul
                        role="list"
                        className="text-muted-foreground mt-8 space-y-2"
                    >
                        {[
                            { value: '90+', label: 'Integrations' },
                            { value: '56%', label: 'Productivity Boost' },
                            { value: '24/7', label: 'Customer Support' },
                            { value: '10k+', label: 'Active Users' },
                        ].map((stat, index) => (
                            <li
                                key={index}
                                className="-ml-0.5 flex items-center gap-1.5"
                            >
                                <ArrowRight className="size-4 opacity-50" />
                                <span className="text-foreground font-medium">{stat.value}</span> {stat.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
