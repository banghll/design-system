// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import React from 'react'
import { Beacon } from '@/components/3p/tailark/_shared/core__ui__svgs__beacon'
import { Bolt } from '@/components/3p/tailark/_shared/core__ui__svgs__bolt'
import { Cisco } from '@/components/3p/tailark/_shared/core__ui__svgs__cisco'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { Linear } from '@/components/3p/tailark/_shared/core__ui__svgs__linear'

export default function LogoCloud() {
    return (
        <section className="bg-background @container py-12">
            <div className="mx-auto max-w-xl px-6">
                <div className="**:fill-foreground @xl:grid-cols-4 grid grid-cols-3 gap-x-8 gap-y-12 *:flex *:items-center *:justify-center">
                    <div>
                        <VercelFull className="h-3.5 w-full" />
                    </div>
                    <div>
                        <Spotify className="h-4.5 w-full" />
                    </div>

                    <div>
                        <SupabaseFull className="h-5" />
                    </div>
                    <div>
                        <Hulu className="h-3.5 w-full" />
                    </div>
                    <div>
                        <Bolt className="h-4 w-full" />
                    </div>
                    <div>
                        <Linear className="size-4" />
                    </div>
                    <div>
                        <Cisco className="h-5 w-full" />
                    </div>
                    <div>
                        <Beacon className="h-3.5 w-full" />
                    </div>
                </div>
            </div>
        </section>
    )
}
