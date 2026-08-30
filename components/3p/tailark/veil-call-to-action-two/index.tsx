// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <Card
                    variant="outline"
                    className="p-8 md:p-12"
                >
                    <div className="text-muted-foreground mb-6 text-sm font-medium">Limited Time Offer</div>
                    <h2 className="text-balance font-serif text-3xl font-medium md:text-4xl">Start Building Today</h2>
                    <p className="text-muted-foreground mt-4 max-w-md text-balance">Get 3 months free when you sign up for an annual plan. No credit card required to start.</p>
                    <Button
                        asChild
                        className="mt-8 gap-2"
                    >
                        <Link href="#link">
                            Claim Your Offer
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </Card>
            </div>
        </section>
    )
}
