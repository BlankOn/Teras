import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import contributorsData from '@/contributors.json'

export const Route = createFileRoute('/$lang/team')({ component: Team })

const avatarColors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#6366f1', '#e11d48',
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
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
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: getColor(name) }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={`https://github.com/${github}.png?size=80`}
      alt={name}
      className="h-12 w-12 shrink-0 rounded-full bg-fd-border object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function Team() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold">{t.team}</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {contributorsData.contributors
            .filter((m) => m.project === 'blankonlinux')
            .map((member) => (
              <a
                key={member.github}
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-fd-border bg-fd-card p-4 transition-all hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
              >
                <MemberAvatar name={member.name} github={member.github} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-fd-foreground">
                    {member.name}
                  </p>
                  <p className="truncate text-sm text-fd-muted-foreground">
                    {member.contribution[lang as keyof typeof member.contribution]}
                  </p>
                </div>
              </a>
            ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold">
            {t.homepage.getInvolvedTitle}
          </h2>
          <p className="mb-8 text-fd-muted-foreground">
            {t.homepage.getInvolvedDescription}
          </p>
          <a
            href="https://t.me/BlankOnLinux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            {t.homepage.joinTelegram}
          </a>
        </div>
      </main>
    </HomeLayout>
  )
}
