// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'
import LogoCloud from './logo-cloud'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="pt-44">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex justify-between gap-6 max-md:flex-col md:items-end lg:mt-16">
                            <h1 className="max-w-2xl text-balance text-5xl font-medium tracking-tight md:text-6xl">Build Software business can rely on</h1>

                            <Button
                                className="w-fit"
                                asChild
                                size="lg">
                                <Link href="#">Get Started</Link>
                            </Button>
                        </div>

                        <div className="relative -mx-2 mt-8 overflow-hidden rounded-3xl bg-black p-2 max-sm:-mr-56 sm:mt-12">
                            <div className="bg-background ring-foreground/6.5 before:mask-radial-at-top-left before:mask-radial-from-65% before:mask-radial-[100%_60%] before:ring-foreground before:border-foreground/10 relative rounded-2xl p-2 shadow-2xl shadow-black/55 ring before:absolute before:-inset-px before:z-10 before:size-56 before:rounded-tl-2xl before:border-l before:border-t">
                                <div className="bg-foreground/2 z-1 absolute inset-0 rounded-2xl"></div>
                                <Image
                                    className="bg-background aspect-15/8 relative rounded-2xl"
                                    src="/mail2.png"
                                    alt="app screen"
                                    width="2700"
                                    height="1440"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}
