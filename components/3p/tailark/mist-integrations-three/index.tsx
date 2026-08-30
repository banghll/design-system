// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Gemini } from '@/components/3p/tailark/_shared/core__ui__svgs__gemini'
import { Replit } from '@/components/3p/tailark/_shared/core__ui__svgs__replit'
import { MagicUI } from '@/components/3p/tailark/_shared/core__ui__svgs__magic-ui'
import { VSCodium } from '@/components/3p/tailark/_shared/core__ui__svgs__vs-codium'
import { MediaWiki } from '@/components/3p/tailark/_shared/core__ui__svgs__media-wiki'
import { GooglePaLM } from '@/components/3p/tailark/_shared/core__ui__svgs__google-palm'

export default function Integrations() {
    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground mt-3 text-lg">Connect seamlessly with popular platforms and services to enhance your workflow.</p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <IntegrationCard
                            title="Google Gemini"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <Gemini />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Replit"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <Replit />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Magic UI"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <MagicUI />
                        </IntegrationCard>

                        <IntegrationCard
                            title="VSCodium"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <VSCodium />
                        </IntegrationCard>

                        <IntegrationCard
                            title="MediaWiki"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <MediaWiki />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Google PaLM"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
                        >
                            <GooglePaLM />
                        </IntegrationCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => {
    return (
        <Card
            variant="soft"
            className="p-6"
        >
            <div className="relative">
                <div className="*:size-10">{children}</div>

                <div className="mt-6 space-y-1.5">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{description}</p>
                </div>
            </div>
        </Card>
    )
}
