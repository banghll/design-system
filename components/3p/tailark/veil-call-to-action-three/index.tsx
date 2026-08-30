// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Mail } from 'lucide-react'

export default function CallToAction() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="@xl:text-left grid items-center gap-8 text-center">
                    <div>
                        <h2 className="text-balance font-serif text-3xl font-medium md:text-4xl">Stay in the Loop</h2>
                        <p className="text-muted-foreground mt-3 text-balance">Get the latest updates, tips, and exclusive offers delivered straight to your inbox.</p>
                    </div>

                    <div className="@max-xl:mx-auto @max-md:flex-col flex w-full max-w-sm gap-2">
                        <div className="ring-input not-dark:bg-card focus-within:ring-ring/15 focus-within:border-primary relative flex flex-1 items-center overflow-hidden rounded-md border border-transparent ring focus-within:ring-[3px]">
                            <Mail className="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="autofill:bg-primary h-8 w-full bg-transparent pl-8 pr-2.5 text-sm outline-none"
                            />
                        </div>
                        <Button
                            asChild
                            className="shrink-0 pr-1.5"
                        >
                            <Link href="#link">
                                Subscribe
                                <ChevronRight className="opacity-50" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
