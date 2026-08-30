// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Button } from '@/components/ui/button'
import { CalendarCheck, ChevronRight, Target } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Features() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="grid gap-12 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <h2 className="text-foreground text-balance text-4xl font-semibold">The AI Coding Assistant that helps you write code faster</h2>
                            <Button
                                className="mt-8 pr-2"
                                variant="outline"
                                asChild
                            >
                                <Link href="#">
                                    Learn more
                                    <ChevronRight className="size-4 opacity-50" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-6 md:col-span-3 md:space-y-10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Target className="size-5" />
                                    <h3 className="text-foreground text-lg font-semibold">Code Generation</h3>
                                </div>
                                <p className="text-muted-foreground mt-3 text-balance">Just describe the code you want to write and we'll generate it for you. From boilerplate code to complex business logic, we've got you covered.</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <CalendarCheck className="size-5" />
                                    <h3 className="text-foreground text-lg font-semibold">Code Review</h3>
                                </div>
                                <p className="text-muted-foreground mt-3 text-balance">Get instant feedback on your code. Our AI will review your code and suggest improvements in terms of best practices and performance.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative -mx-12 mt-16 px-12">
                        <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                            <Image
                                src="/mist/tailark-2.png"
                                alt="app screen"
                                width="2880"
                                height="1842"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
