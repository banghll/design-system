// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { InfiniteSlider } from '@/components/3p/tailark/_shared/core__ui__motion-primitives__infinite-slider'
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'
import { Bolt } from '@/components/3p/tailark/_shared/core__ui__svgs__bolt'

const Logos = () => {
    return (
        <>
            <Bolt
                height={24}
                width={58}
            />
            <VercelFull
                height={24}
                width={100}
            />
            <SupabaseFull className="h-7" />
            <Hulu
                height={20}
                width={60}
            />
            <Spotify
                height={28}
                width={90}
            />
        </>
    )
}

export default function LogoCloud() {
    return (
        <section className="bg-background py-12">
            <div className="relative m-auto max-w-7xl px-6">
                <div className="**:fill-foreground relative flex gap-6 max-lg:flex-col lg:items-center lg:gap-12">
                    <p className="text-muted-foreground shrink-0 lg:border-r lg:pr-12 lg:text-end">
                        Powering the <br className="max-lg:hidden" /> best teams
                    </p>

                    <div className="hidden w-full flex-wrap justify-between gap-6 lg:flex">
                        <Logos />
                    </div>
                    <InfiniteSlider
                        gap={56}
                        className="mask-x-from-85% mask-x-to-99% lg:hidden"
                    >
                        <Logos />
                    </InfiniteSlider>
                </div>
            </div>
        </section>
    )
}
