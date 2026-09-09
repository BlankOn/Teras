import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import LaptopScroll from '@/components/laptop-scroll'
import { baseOptions, getTranslations } from '@/lib/layout.shared'

// The scroll-driven Sinambung teaser. The previous landing page is still at
// /$lang/revival.
export const Route = createFileRoute('/$lang/')({ component: Home })

const TELEGRAM_URL = 'https://t.me/BlankOnLinux/1'
const STAGING_GIST_URL =
  'https://gist.github.com/herpiko/a1cde839af39636c8bc71929dfa709b9'

function Home() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <LaptopScroll
        lang={lang}
        copy={{
          ...t.sneakPeek,
          learnMoreUrl: STAGING_GIST_URL,
          ctaUrl: TELEGRAM_URL,
        }}
      />
    </HomeLayout>
  )
}
