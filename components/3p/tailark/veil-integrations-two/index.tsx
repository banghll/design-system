// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { ChevronRight } from 'lucide-react'
import { Vercel } from '@/components/3p/tailark/_shared/core__ui__svgs__vercel'
import { Supabase } from '@/components/3p/tailark/_shared/core__ui__svgs__supabase'
import { Linear } from '@/components/3p/tailark/_shared/core__ui__svgs__linear'
import { Slack } from '@/components/3p/tailark/_shared/core__ui__svgs__slack'
import { Firebase } from '@/components/3p/tailark/_shared/core__ui__svgs__firebase'
import { ClerkIconDark as Clerk } from '@/components/3p/tailark/_shared/core__ui__svgs__clerk'
import { LogoIcon } from '@/components/3p/tailark/_shared/bases__radix__mist__ui__logo'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Integrations() {
    return (
        <section className="bg-background @container py-24">
            <div className="mx-auto max-w-2xl">
                <IntegrationsIllustration />
                <div className="mx-auto mt-12 max-w-md text-balance px-6 text-center">
                    <h2 className="font-serif text-4xl font-medium">Connect Your Favorite Tools</h2>
                    <p className="text-muted-foreground mb-6 mt-4">Seamlessly integrate with the services you already use. Set up in minutes, not days.</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        asChild
                        className="gap-1 pr-1.5"
                    >
                        <Link href="#">
                            Learn more
                            <ChevronRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

const IntegrationsIllustration = () => {
    return (
        <div
            aria-hidden
            className="**:fill-foreground @max-md:scale-85 relative mx-auto flex size-96"
        >
            <div className="bg-card shadow-black/6.5 ring-border absolute inset-0 m-auto flex size-12 items-center rounded-full shadow-sm ring *:m-auto">
                <LogoIcon className="size-5" />
            </div>
            <div className="rotate-120 *:-rotate-120 absolute inset-0 flex items-center justify-between gap-12">
                <div className="border-foreground/10 absolute inset-4 rounded-full border border-dashed" />

                <div className="bg-muted relative flex size-9 items-center rounded-full border backdrop-blur *:m-auto">
                    <Firebase className="size-3.5" />
                </div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex size-9 items-center rounded-full shadow-sm ring *:m-auto">
                    <Supabase className="size-3.5" />
                </div>
            </div>
            <div className="absolute inset-12 flex items-center justify-between gap-12">
                <div className="border-foreground/10 absolute inset-4 rounded-full border border-dashed" />

                <div className="bg-muted relative flex size-9 items-center rounded-full border backdrop-blur *:m-auto">
                    <Vercel className="size-3.5" />
                </div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex size-9 items-center rounded-full shadow-sm ring *:m-auto">
                    <Slack className="size-3.5" />
                </div>
            </div>
            <div className="absolute inset-24 flex rotate-45 items-center justify-between gap-12 *:-rotate-45">
                <div className="border-foreground/10 absolute inset-4 rounded-full border border-dashed" />

                <div className="bg-card shadow-black/6.5 ring-border relative flex size-9 items-center rounded-full shadow-sm ring *:m-auto">
                    <Clerk className="size-3.5" />
                </div>
                <div className="bg-muted relative flex size-9 items-center rounded-full border backdrop-blur *:m-auto">
                    <Linear className="size-3.5" />
                </div>
            </div>
        </div>
    )
}
