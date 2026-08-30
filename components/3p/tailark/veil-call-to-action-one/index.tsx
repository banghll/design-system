// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="text-center">
                    <h2 className="text-balance font-serif text-4xl font-medium">Ready to Get Started?</h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">Join thousands of teams already using our platform to build better products faster.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button
                            asChild
                            className="pr-1.5"
                        >
                            <Link href="#link">
                                <span>Start Free Trial</span>
                                <ChevronRight className="opacity-50" />
                            </Link>
                        </Button>
                        <Button
                            variant="secondary"
                            asChild
                        >
                            <Link href="#link">Talk to Sales</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
