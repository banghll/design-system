// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
'use client'
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'
import { Bolt } from '@/components/3p/tailark/_shared/core__ui__svgs__bolt'
import { Beacon } from '@/components/3p/tailark/_shared/core__ui__svgs__beacon'
import { useMedia } from '@/components/3p/tailark/_shared/core__hooks__use-media'
import { InfiniteSlider } from '@/components/3p/tailark/_shared/core__ui__motion-primitives__infinite-slider'

export default function LogoCloud() {
    const isLarge = useMedia('(min-width: 64rem)')

    const Logos = () => {
        return (
            <>
                <Hulu
                    height={20}
                    width={60}
                />

                <VercelFull
                    height={24}
                    width={100}
                />

                <Bolt
                    height={24}
                    width={58}
                />

                <SupabaseFull className="h-7" />

                <Beacon
                    height={26}
                    width={92}
                />

                <Spotify
                    height={28}
                    width={90}
                />
            </>
        )
    }

    return (
        <section className="bg-background">
            <div className="**:fill-foreground relative m-auto max-w-7xl">
                {isLarge ? (
                    <div className="relative flex items-center justify-between px-6 py-12">
                        <Logos />
                    </div>
                ) : (
                    <InfiniteSlider
                        gap={44}
                        className="mask-x-from-85% mask-x-to-99% *:[&>svg]:scale-80 py-8"
                    >
                        <Logos />
                    </InfiniteSlider>
                )}
            </div>
        </section>
    )
}
