// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Spotify } from '@/components/3p/tailark/_shared/core__ui__svgs__spotify'
import { SupabaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Hulu } from '@/components/3p/tailark/_shared/core__ui__svgs__hulu'
import { FirebaseFull } from '@/components/3p/tailark/_shared/core__ui__svgs__firebase'
import { Beacon } from '@/components/3p/tailark/_shared/core__ui__svgs__beacon'
import { Bolt } from '@/components/3p/tailark/_shared/core__ui__svgs__bolt'
import { Claude } from '@/components/3p/tailark/_shared/core__ui__svgs__claude'
import { VercelFull } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import Link from 'next/link'
import { ChevronsRight } from 'lucide-react'

export default function LogoCloud() {
    return (
        <section className="bg-background py-16">
            <div className="group relative m-auto max-w-5xl px-6">
                <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <Link
                        href="/"
                        className="block text-sm duration-150 hover:opacity-75"
                    >
                        <span> See the network</span>

                        <ChevronsRight className="ml-1 inline-block size-3" />
                    </Link>
                </div>
                <div className="group-hover:blur-xs **:fill-foreground mx-auto grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 md:grid-cols-4">
                    <div className="flex items-center">
                        <Bolt className="mx-auto h-5 w-full" />
                    </div>
                    <div className="flex items-center">
                        <VercelFull className="mx-auto h-4 w-full" />
                    </div>
                    <div className="flex items-center">
                        <SupabaseFull className="mx-auto h-6" />
                    </div>
                    <div className="flex items-center">
                        <Hulu className="mx-auto h-4 w-full" />
                    </div>
                    <div className="flex items-center">
                        <Spotify className="mx-auto h-6 w-full" />
                    </div>
                    <div className="flex items-center">
                        <FirebaseFull className="mx-auto h-6 w-full" />
                    </div>
                    <div className="hidden items-center sm:flex">
                        <Beacon className="mx-auto h-4 w-full" />
                    </div>

                    <div className="hidden items-center sm:flex">
                        <Claude className="mx-auto h-5 w-full" />
                    </div>
                </div>
            </div>
        </section>
    )
}
