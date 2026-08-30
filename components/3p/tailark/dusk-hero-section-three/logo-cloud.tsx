// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'
import { Bolt } from '@/components/3p/tailark/_shared/core__ui__svgs__bolt'
import { Beacon } from '@/components/3p/tailark/_shared/core__ui__svgs__beacon'

export const LogoCloud = () => {
    return (
        <div className="**:fill-muted-foreground relative mt-24 flex flex-wrap items-center justify-center gap-8 md:gap-x-16">
            <Bolt
                height={22}
                width={54}
            />
            <VercelFull
                height={22}
                width={84}
            />
            <SupabaseFull className="h-6" />
            <Hulu
                height={18}
                width={56}
            />
            <Spotify
                height={26}
                width={84}
            />
            <Beacon
                height={24}
                width={80}
            />
        </div>
    )
}
