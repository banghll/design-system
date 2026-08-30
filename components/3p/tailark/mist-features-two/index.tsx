// @ts-nocheck
/* 벤더 코드 — scripts/seal-3p.mjs 가 붙인 표시다.
 * 원본을 그대로 두려고 타입 검사만 면제한다. 실제로 그려지는지는
 * scripts/gen-3p.mjs 의 검증이 확인한다. */
import { Card } from '@/components/ui/card'

export default function Features() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground text-4xl font-semibold">Effortless Task Management</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Automate your tasks and workflows by connecting your favorite tools like Notion, Todoist, and more. AI-powered scheduling helps you stay on track and adapt to changing priorities.</p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
                        <div className="space-y-4">
                            <Card
                                className="aspect-video overflow-hidden px-6"
                                variant="soft"
                            >
                                <Card className="h-full translate-y-6" />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">Marketing Campaigns</h3>
                                <p className="text-muted-foreground my-4 text-lg">Effortlessly book and manage your meetings. Stay on top of your schedule.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card
                                className="aspect-video overflow-hidden p-6"
                                variant="soft"
                            >
                                <Card className="h-full" />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">AI Meeting Scheduler</h3>
                                <p className="text-muted-foreground my-4 text-lg">Effortlessly book and manage your meetings. Stay on top of your schedule.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card
                                className="aspect-video overflow-hidden"
                                variant="soft"
                            >
                                <Card className="translate-6 h-full" />
                            </Card>
                            <div className="sm:max-w-sm">
                                <h3 className="text-foreground text-xl font-semibold">AI Meeting Scheduler</h3>
                                <p className="text-muted-foreground my-4 text-lg">Effortlessly book and manage your meetings. Stay on top of your schedule.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
