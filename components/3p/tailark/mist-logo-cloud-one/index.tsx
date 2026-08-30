// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'

export default function LogoCloud() {
    return (
        <section>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div>
                    <p className="text-muted-foreground font-medium">Trusted by teams at :</p>
                    <div className="**:fill-foreground mt-4 flex items-center gap-12">
                        <Spotify
                            height={22}
                            width={73}
                        />
                        <VercelFull
                            height={20}
                            width={76}
                        />
                        <SupabaseFull className="h-[22px]" />
                        <Hulu
                            height={16}
                            width={50}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
