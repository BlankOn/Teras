import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import SiteFooter from '@/components/site-footer'
import contributorsData from '@/contributors.json'

export const Route = createFileRoute('/$lang/team')({ component: Team })

const CONTRIBUTE_URL = 'https://blankonlinux.id/en/wiki/HowToContribute'

// The pill the home page closes with, in theme tokens rather than the hero's
// fixed dark palette.
const CTA_CLASS =
  'inline-flex min-w-[9.5rem] items-center justify-center rounded-full border border-fd-border bg-fd-card px-8 py-4 text-base font-medium text-fd-foreground transition hover:-translate-y-px hover:border-fd-primary/50 hover:bg-fd-accent max-sm:w-full'

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

function MemberAvatar({ name, github }: { name: string; github: string }) {
  const [failed, setFailed] = useState(false)

  if (!github || failed) {
    return (
      <div
        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
        style={{ backgroundColor: getColor(name) }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      // The image can fail before hydration attaches onError, which would leave
      // the alt text spilling out of the circle; catch that case on mount too.
      ref={(node) => {
        if (node?.complete && node.naturalWidth === 0) setFailed(true)
      }}
      src={`https://github.com/${github}.png?size=256`}
      alt={name}
      className="h-28 w-28 shrink-0 rounded-full bg-fd-border object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function Team() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)
  const [sortBy, setSortBy] = useState<'team' | 'name'>('team')

  // contributors.json lists members team by team, in the order of
  // Contributors.md, so sorting "by team" keeps that order and only orders
  // names within each team.
  const teamOrder: Array<string> = []
  const members = contributorsData.contributors.filter(
    (m) => m.project === 'blankonlinux',
  )
  for (const m of members) {
    if (!teamOrder.includes(m.contribution.en))
      teamOrder.push(m.contribution.en)
  }
  const sorted = [...members].sort((a, b) =>
    sortBy === 'team'
      ? teamOrder.indexOf(a.contribution.en) -
          teamOrder.indexOf(b.contribution.en) || a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name),
  )
  const sortOptions = [
    { id: 'team' as const, label: t.teamSortByTeam },
    { id: 'name' as const, label: t.teamSortByName },
  ]

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-16">
        <h1 className="text-center text-3xl font-bold">{t.team}</h1>
        <div
          role="group"
          aria-label={t.teamSortLabel}
          className="mx-auto mb-8 mt-4 inline-flex self-center rounded-full border border-fd-border p-0.5 text-xs"
        >
          {sortOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={sortBy === id}
              onClick={() => setSortBy(id)}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                sortBy === id
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((member) => {
            const card = (
              <>
                <MemberAvatar name={member.name} github={member.github} />
                <p className="mt-3 text-base font-medium text-fd-foreground">
                  {member.name}
                </p>
                <p className="text-sm text-fd-muted-foreground">
                  {
                    member.contribution[
                      lang as keyof typeof member.contribution
                    ]
                  }
                </p>
              </>
            )
            // Not everyone on the team has a GitHub account to point at.
            return member.github ? (
              <a
                key={member.name}
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl p-4 text-center transition-colors hover:bg-fd-accent"
              >
                {card}
              </a>
            ) : (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-xl p-4 text-center"
              >
                {card}
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold">
            {t.homepage.getInvolvedTitle}
          </h2>
          <p className="mb-8 text-fd-muted-foreground">
            {t.homepage.getInvolvedDescription}
          </p>
          {/* The pair reads as one row, like the calls to action closing the
              home page - same pill, in the page's own palette. */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://t.me/BlankOnLinux"
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_CLASS}
            >
              {t.homepage.joinTelegram}
            </a>
            <a
              href={CONTRIBUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_CLASS}
            >
              {t.homepage.howToContribute}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </HomeLayout>
  )
}
