// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex items-center justify-center gap-6 max-lg:flex-col max-lg:text-center lg:items-end lg:justify-between">
                    <h2 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight xl:text-6xl">Start building from here</h2>

                    <Button
                        asChild
                        size="lg"
                    >
                        <Link href="#">Get Started</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
