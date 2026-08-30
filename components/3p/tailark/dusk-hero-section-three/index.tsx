// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { HeroHeader } from './header'
import { LogoCloud } from './logo-cloud'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />

            <main className="overflow-hidden">
                <section>
                    <div className="relative mx-auto px-4 pb-4 pt-32 lg:pt-44">
                        <div className="mx-auto max-w-7xl px-6">
                            <h1 className="relative z-10 mx-auto max-w-xl text-balance text-center text-4xl font-medium tracking-tight">
                                <span className="text-muted-foreground">Train Smarter. Recover faster with</span> a personal coach
                            </h1>

                            <LogoCloud />
                        </div>

                        <div className="relative mt-12 overflow-hidden rounded-2xl py-20">
                            <Image
                                src="/woman-meditating-in-mountains.jpg"
                                alt="hero background"
                                width={2000}
                                height={1331}
                                className="absolute inset-0 size-full object-cover grayscale"
                            />

                            <div className="relative z-10">
                                <div className="aspect-27/58 rounded-4xl ring-foreground/15 after:border-foreground/10 absolute inset-0 mx-auto max-w-72 border border-black/15 bg-zinc-900/75 shadow-2xl ring backdrop-blur after:absolute after:-inset-3 after:rounded-[2.5rem] after:border"></div>

                                <div
                                    aria-hidden
                                    className="aspect-27/58 relative mx-auto max-w-72 overflow-hidden"
                                >
                                    <Image
                                        src="/strava.png"
                                        alt="strava app screenshot"
                                        width={1284}
                                        height={2778}
                                        className="rounded-4xl size-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
