import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions, getTranslations } from '@/lib/layout.shared'

export const Route = createFileRoute('/$lang/')({ component: Home })

function Home() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">BlankOn</h1>
        <p className="mt-4 text-fd-muted-foreground">{t.welcome}</p>
      </main>
    </HomeLayout>
  )
}
