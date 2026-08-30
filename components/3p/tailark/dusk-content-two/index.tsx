// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Button } from '@/components/ui/button'
import { ChevronRight, Cpu, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-12">
                    <h2 className="max-w-md text-balance text-4xl font-medium tracking-tight lg:text-5xl">A CRM workspace for every customer relationship.</h2>
                    <div className="space-y-6 lg:space-y-12">
                        <p className="text-muted-foreground text-balance text-lg">Tailark keeps pipeline, conversations, tasks, and account history connected so teams can spot the next best move, follow up with context, and turn every customer signal into momentum.</p>

                        <div className="grid gap-4 pt-6 sm:grid-cols-2">
                            <p className="text-muted-foreground text-balance text-lg">
                                <span className="text-foreground font-medium">
                                    <Zap className="inline size-4 -translate-y-0.5" /> Fast.
                                </span>{' '}
                                Move from signal to follow-up without losing context.
                            </p>

                            <p className="text-muted-foreground text-balance text-lg">
                                <span className="text-foreground font-medium">
                                    <Cpu className="inline size-4 -translate-y-0.5" /> Powerful.
                                </span>{' '}
                                Unify pipeline, tasks, and account history.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
