// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Button } from '@/components/ui/button'
import { Gemini } from '@/components/3p/tailark/_shared/core__ui__svgs__gemini'
import { GooglePaLM } from '@/components/3p/tailark/_shared/core__ui__svgs__google-palm'
import { Replit } from '@/components/3p/tailark/_shared/core__ui__svgs__replit'
import { MediaWiki } from '@/components/3p/tailark/_shared/core__ui__svgs__media-wiki'
import { MagicUI } from '@/components/3p/tailark/_shared/core__ui__svgs__magic-ui'
import { VSCodium } from '@/components/3p/tailark/_shared/core__ui__svgs__vs-codium'
import Link from 'next/link'

export default function Integrations() {
    return (
        <section>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="space-y-6 text-center">
                    <h2 className="text-foreground text-2xl font-semibold">Integrate with your favorite tools : </h2>
                    <div className="*:bg-foreground/5 mx-auto flex max-w-xl flex-wrap justify-center gap-0.5 *:rounded *:p-6 *:first:rounded-l-xl *:last:rounded-r-xl">
                        <div>
                            <Gemini className="m-auto size-8" />
                        </div>
                        <div>
                            <GooglePaLM className="m-auto size-8" />
                        </div>
                        <div>
                            <Replit className="m-auto size-8" />
                        </div>
                        <div>
                            <MediaWiki className="m-auto size-8" />
                        </div>
                        <div>
                            <MagicUI className="m-auto size-8" />
                        </div>
                        <div>
                            <VSCodium className="m-auto size-8" />
                        </div>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                    >
                        <Link href="#">More Integrations</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
