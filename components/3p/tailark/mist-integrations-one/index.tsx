// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Gemini } from '@/components/3p/tailark/_shared/core__ui__svgs__gemini'
import { Replit } from '@/components/3p/tailark/_shared/core__ui__svgs__replit'
import { MediaWiki } from '@/components/3p/tailark/_shared/core__ui__svgs__media-wiki'
import { MagicUI } from '@/components/3p/tailark/_shared/core__ui__svgs__magic-ui'
import { VSCodium } from '@/components/3p/tailark/_shared/core__ui__svgs__vs-codium'
import { GooglePaLM } from '@/components/3p/tailark/_shared/core__ui__svgs__google-palm'

export default function Integrations() {
    return (
        <section>
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="flex flex-wrap items-center gap-4">
                    <p className="text-muted-foreground font-medium">Integrate with : </p>
                    <div className="max-w-2xs flex flex-wrap gap-3 divide-x *:pr-3">
                        <div>
                            <Gemini className="m-auto size-5" />
                        </div>
                        <div>
                            <GooglePaLM className="m-auto size-5" />
                        </div>
                        <div>
                            <Replit className="m-auto size-5" />
                        </div>
                        <div>
                            <MediaWiki className="m-auto size-5" />
                        </div>
                        <div>
                            <MagicUI className="m-auto size-5" />
                        </div>
                        <div>
                            <VSCodium className="m-auto size-5" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
