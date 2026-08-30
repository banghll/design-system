// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Button } from '@/components/ui/button'
import { Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <section>
            <div className="bg-muted py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-foreground max-w-lg text-balance text-3xl font-semibold lg:text-4xl">
                        <span className="text-muted-foreground">Build Modern Websites.</span> Drive Results
                    </h2>
                    <p className="mt-4 text-lg">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p>
                    <div className="mt-8 flex gap-3">
                        <Button
                            asChild
                            className="pr-2"
                        >
                            <Link href="#">
                                Try Mist for Free
                                <ChevronRight
                                    strokeWidth={2.5}
                                    className="size-3.5! opacity-50"
                                />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="pl-2.5"
                        >
                            <Link href="#">
                                <Calendar
                                    className="size-3.5! opacity-50"
                                    strokeWidth={2.5}
                                />
                                Request a Demo
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
