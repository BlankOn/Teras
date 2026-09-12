import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import SiteFooter from '@/components/site-footer'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/$lang/revival')({ component: Revival })

/*
 * The revival closed on 12 September 2026, so the roll of honour below is a
 * frozen record of who saw it through - deliberately its own copy of the
 * names rather than a read of src/contributors.json or a link to /team, both
 * of which go on changing. It merges the revival contributors with the
 * BlankOn Foundation team (blankon.id/en/team); anyone in both carries both
 * roles.
 */
// The foundation's own portraits, served from blankon.id, and the page they
// come from - the people carried over from there have no GitHub account to
// point at.
const FOUNDATION_URL = 'https://blankon.id/en/team'

const ROSTER: Array<{
  name: string
  github?: string
  avatar?: string
  url?: string
  role: { id: string; en: string }
}> = [
  {
    name: 'Akhmat Safrudin',
    avatar: 'https://blankon.id/images/akhmat-safrudin.png',
    url: FOUNDATION_URL,
    role: { id: 'Pengawas Yayasan', en: 'Foundation Supervisor' },
  },
  {
    name: 'Aris Fathur Rahman',
    github: 'ar1sfr',
    role: { id: 'Riset dan Pengembangan', en: 'Research and Development' },
  },
  {
    name: 'Atqa Munzir Zakaria',
    github: 'atqamz',
    role: { id: 'Riset dan Pengembangan', en: 'Research and Development' },
  },
  {
    name: 'Firmansyah Dzakwan Arifien',
    github: 'FirmansyahDzakwanArifien',
    role: { id: 'Infrastruktur', en: 'Infrastructure' },
  },
  {
    name: 'Hanhan Husna',
    github: 'hahn',
    role: { id: 'Pemelihara Paket', en: 'Package Maintainer' },
  },
  {
    name: 'Harry Suryapambagya',
    github: 'harsxv',
    role: { id: 'Infrastruktur', en: 'Infrastructure' },
  },
  {
    name: 'Herpiko Dwi Aguno',
    github: 'herpiko',
    role: {
      id: 'Direktur Eksekutif Yayasan · Pemelihara Paket',
      en: 'Foundation Executive Director · Package Maintainer',
    },
  },
  {
    name: 'Iwan stwn',
    avatar: 'https://blankon.id/images/iwan.png',
    url: FOUNDATION_URL,
    role: { id: 'Manajer Program Yayasan', en: 'Foundation Program Manager' },
  },
  {
    name: 'Lucky Mahendra Purba',
    github: 'luckynee',
    role: { id: 'Pemelihara Paket', en: 'Package Maintainer' },
  },
  {
    name: 'Mohammad Raska',
    github: 'Adekabang',
    role: { id: 'Pemelihara Paket', en: 'Package Maintainer' },
  },
  {
    name: 'Raffi Febriandika Utama',
    github: 'raffifu',
    role: { id: 'Pemelihara Paket', en: 'Package Maintainer' },
  },
  {
    name: 'Rusmanto',
    avatar: 'https://blankon.id/images/rusmanto.jpg',
    url: FOUNDATION_URL,
    role: { id: 'Penasihat Yayasan', en: 'Foundation Advisor' },
  },
  {
    name: 'Sistiandy Syahbana Nugraha',
    github: 'siscms',
    role: { id: 'Hubungan Masyarakat', en: 'Public Relation' },
  },
]

const avatarColors = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#e11d48',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function getColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function MemberAvatar({
  name,
  github,
  avatar,
}: {
  name: string
  github?: string
  avatar?: string
}) {
  const [failed, setFailed] = useState(false)
  const src =
    avatar ?? (github ? `https://github.com/${github}.png?size=256` : '')

  if (!src || failed) {
    return (
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
        style={{ backgroundColor: getColor(name) }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      // The image can fail before hydration attaches onError, which would
      // leave the alt text spilling out of the circle; catch that on mount too.
      ref={(node) => {
        if (node?.complete && node.naturalWidth === 0) setFailed(true)
      }}
      src={src}
      alt={name}
      className="h-24 w-24 shrink-0 rounded-full bg-fd-border object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function Member({
  member,
  lang,
}: {
  member: (typeof ROSTER)[number]
  lang: string
}) {
  const body = (
    <>
      <MemberAvatar
        name={member.name}
        github={member.github}
        avatar={member.avatar}
      />
      <p className="mt-3 text-base font-medium text-fd-foreground">
        {member.name}
      </p>
      <p className="text-sm text-fd-muted-foreground">
        {member.role[lang as keyof typeof member.role]}
      </p>
    </>
  )
  const className = 'flex flex-col items-center rounded-xl p-4 text-center'

  // GitHub for the contributors, the foundation's own team page for the
  // people carried over from it.
  const href =
    member.url ?? (member.github && `https://github.com/${member.github}`)

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className, 'transition-colors hover:bg-fd-accent')}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  )
}

// Long raw URLs wrap badly on phones; show the host instead and keep the full
// address in the link's title.
function linkLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function Revival() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 pb-8 pt-24 text-center">
          <img
            src="/blankon-revival-project-black.png"
            alt="BlankOn Revival Project"
            width={1794}
            height={728}
            className="mb-8 block h-auto max-h-56 w-auto max-w-full object-contain dark:hidden"
          />
          <img
            src="/blankon-revival-project-white.png"
            alt="BlankOn Revival Project"
            width={726}
            height={294}
            className="mb-8 hidden h-auto max-h-56 w-auto max-w-full object-contain dark:block"
          />
          <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">
            {Array.isArray(t.homepage.heroTagline)
              ? t.homepage.heroTagline.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < t.homepage.heroTagline.length - 1 && <br />}
                  </span>
                ))
              : t.homepage.heroTagline}
          </p>
        </section>

        {/* About Section */}
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-0">
          <p className="text-center text-fd-muted-foreground">
            {t.homepage.aboutDescription}
          </p>
        </section>

        {/* The revival is done: the notice, and the people who did it. */}
        <section className="mx-auto w-full max-w-3xl px-4">
          <div className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300">
            {t.homepage.revivalComplete}
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.teamTitle}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ROSTER.map((member) => (
              <Member key={member.name} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.faqTitle}
          </h2>
          <div className="space-y-2">
            <FAQItem question={t.homepage.faq.q2} answer={t.homepage.faq.a2} />
            <FAQItem question={t.homepage.faq.q3} answer={t.homepage.faq.a3} />
            <FAQItem question={t.homepage.faq.q4} answer={t.homepage.faq.a4} />
            <FAQItem question={t.homepage.faq.q5} answer={t.homepage.faq.a5} />
            <FAQItem question={t.homepage.faq.q6} answer={t.homepage.faq.a6} />
            <FAQItem question={t.homepage.faq.q7} answer={t.homepage.faq.a7} />
            <FAQItem question={t.homepage.faq.q8} answer={t.homepage.faq.a8} />
            <FAQItem question={t.homepage.faq.q9} answer={t.homepage.faq.a9} />
            <FAQItem
              question={t.homepage.faq.q10}
              answer={t.homepage.faq.a10}
            />
          </div>
        </section>

        {/* Updates Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.updatesTitle}
          </h2>
          <ol className="relative border-s border-fd-border">
            {t.homepage.updates.map((item) => (
              <li key={item.date} className="mb-8 ms-5 sm:ms-6">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-fd-background bg-fd-muted-foreground" />
                <time className="block text-sm font-normal text-fd-muted-foreground">
                  {item.date}
                </time>
                <p className="mt-1 text-base text-fd-foreground">{item.text}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.url}
                    className="mt-2 inline-flex max-w-full items-center gap-1 break-words text-sm text-fd-primary underline underline-offset-4 hover:opacity-80"
                  >
                    {linkLabel(item.url)}
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </HomeLayout>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-fd-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-fd-accent/50"
      >
        {question}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <p className="px-4 pb-4 pt-3 text-fd-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}
