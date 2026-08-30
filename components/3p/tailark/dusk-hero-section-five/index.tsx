// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight } from 'lucide-react'
import LogoCloud from './logo-cloud'
import HeroVideo from './hero-video'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="lg:min-h-200 sm:aspect-3/2 min-[1996px]:max-h-240 relative mx-auto flex aspect-square flex-col justify-end lg:aspect-auto xl:aspect-video">
                        <div className="relative z-10 flex flex-col justify-end">
                            <div className="mx-auto w-full max-w-7xl px-6 pb-6 lg:pb-12">
                                <div className="flex flex-wrap items-end justify-between gap-4 lg:w-2/3">
                                    <h1 className="max-w-md text-balance text-5xl md:text-6xl">Build 10x Faster with Ada</h1>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            className="pr-2.5"
                                        >
                                            <Link href="#link">
                                                <span className="text-nowrap">Start Building</span>
                                                <ChevronRight className="ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mask-y-from-45% mask-b-to-90% 2xl:mask-x-from-90% pointer-events-none absolute inset-0">
                            <HeroVideo />
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}
