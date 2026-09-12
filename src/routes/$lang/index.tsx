import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import LaptopScroll from '@/components/laptop-scroll'
import SiteFooter from '@/components/site-footer'
import { baseOptions, getTranslations } from '@/lib/layout.shared'

// The scroll-driven Sinambung teaser. The previous landing page is still at
// /$lang/revival.
export const Route = createFileRoute('/$lang/')({ component: Home })

const TELEGRAM_URL = 'https://t.me/BlankOnLinux'
const STAGING_GIST_URL =
  'https://gist.github.com/herpiko/a1cde839af39636c8bc71929dfa709b9'
// Praya, the town in Lombok the desktop is named after.
const PRAYA_WIKI_URL = 'https://en.wikipedia.org/wiki/Praya,_Lombok'
const PRAYA_GUIDE_URL = 'https://blankonlinux.id/en/wiki/userguides/praya'
const CONTRIBUTE_URL = 'https://blankonlinux.id/en/wiki/howtocontribute'
const DONATE_URL = 'https://blankon.id/en/donate'

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
          prayaUrl: PRAYA_WIKI_URL,
          prayaLearnMoreUrl: PRAYA_GUIDE_URL,
          ctaUrl: TELEGRAM_URL,
          contributeUrl: CONTRIBUTE_URL,
          donateUrl: DONATE_URL,
        }}
      />
      <SiteFooter lang={lang} />
    </HomeLayout>
  )
}
