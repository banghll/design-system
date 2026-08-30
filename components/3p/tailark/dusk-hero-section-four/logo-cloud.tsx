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
                <Beacon
                    height={26}
                    width={92}
                />
            </>
        )
    }

    return (
        <section className="bg-background pb-16 pt-4">
            <div className="**:fill-foreground relative m-auto max-w-7xl">
                {isLarge ? (
                    <div className="relative flex items-center justify-between p-6">
                        <Logos />
                    </div>
                ) : (
                    <InfiniteSlider
                        gap={56}
                        className="mask-x-from-85% mask-x-to-99%"
                    >
                        <Logos />
                    </InfiniteSlider>
                )}
            </div>
        </section>
    )
}
