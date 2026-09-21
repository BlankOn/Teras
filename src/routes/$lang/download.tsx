import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useEffect, useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import SiteFooter from '@/components/site-footer'

export const Route = createFileRoute('/$lang/download')({ component: Download })

// The rolling release is the one to hand most people; the daily stitch is the
// development build, and carries the warning that goes with it.
const ROLLING_DIR_URL = 'https://jahitan.blankonlinux.id/releases/current/'
// Each release renames its image, so the page reads the directory listing to
// find it. This is only the last-known-good answer, used until that listing
// arrives or when it can't be read.
const FALLBACK_ROLLING_ISO_URL = `${ROLLING_DIR_URL}blankon-sinambung-26.09-verbeek-amd64.iso`

type RollingRelease = { isoUrl: string; sha256sumUrl: string }

const FALLBACK_ROLLING: RollingRelease = {
  isoUrl: FALLBACK_ROLLING_ISO_URL,
  sha256sumUrl: `${FALLBACK_ROLLING_ISO_URL}.sha256sum`,
}

// Picks the image out of nginx's autoindex page, along with whichever
// checksum name sits beside it - older releases dropped the .iso before
// .sha256sum, newer ones keep it.
function parseRollingListing(html: string): RollingRelease | undefined {
  const hrefs = [...html.matchAll(/href="([^"?/]+)"/g)].map((m) => m[1])
  const iso = hrefs.find((h) => h.endsWith('.iso') && h.includes('amd64'))
  if (!iso) return undefined
  const sha256sum =
    [`${iso}.sha256sum`, `${iso.replace(/\.iso$/, '')}.sha256sum`].find((h) =>
      hrefs.includes(h),
    ) ?? `${iso}.sha256sum`
  return {
    isoUrl: new URL(iso, ROLLING_DIR_URL).href,
    sha256sumUrl: new URL(sha256sum, ROLLING_DIR_URL).href,
  }
}

// Undefined while the listing is still being read.
function useRollingRelease() {
  const [release, setRelease] = useState<RollingRelease>()

  useEffect(() => {
    const controller = new AbortController()
    let unmounted = false
    const timeout = setTimeout(() => controller.abort(), 8000)
    fetch(ROLLING_DIR_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((html) => setRelease(parseRollingListing(html) ?? FALLBACK_ROLLING))
      .catch((err: unknown) => {
        // Leaving the page isn't a failure worth reporting; a timeout is.
        if (unmounted) return
        console.error('Could not read the rolling release listing:', err)
        setRelease(FALLBACK_ROLLING)
      })
      .finally(() => clearTimeout(timeout))
    return () => {
      unmounted = true
      controller.abort()
    }
  }, [])

  return release
}

const DEVELOPMENT_ISO_URL =
  'https://jahitan.blankonlinux.id/harian/current/blankon-live-image-amd64.hybrid.iso'

// Each build names its own image, so the filename shown comes off the URL
// rather than from one constant shared by both tabs.
const isoFilename = (isoUrl: string) => isoUrl.split('/').pop() ?? ''
// zsync speaks plain HTTP only, so the command gets an http:// URL even though
// every link on this page stays on https.
const zsyncUrl = (isoUrl: string) =>
  `${isoUrl.replace(/^https:\/\//, 'http://')}.zsync`

function DownloadIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11"
      />
    </svg>
  )
}

// The download card and its file details. Both tabs are the same panel, only
// the image they point at - and the warning - differ.
function ReleasePanel({
  d,
  isoUrl,
  sha256sumUrl,
  releaseValue,
  warning,
  zsync,
}: {
  d: ReturnType<typeof getTranslations>['downloadPage']
  isoUrl: string
  sha256sumUrl: string
  releaseValue: string
  warning?: string
  // Only the build that moves every day is worth following with zsync.
  zsync?: boolean
}) {
  const filename = isoFilename(isoUrl)

  return (
    <>
      {warning && (
        <div className="mt-6 space-y-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300">
          <p>{warning}</p>
          <p>{d.dailyBuildRepo}</p>
          <p>{d.dailyBuildContribute}</p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-fd-border bg-fd-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-2xl">
            💿
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-medium">{filename}</p>
            <p className="text-xs text-fd-muted-foreground">{d.typeValue}</p>
          </div>
        </div>

        <a
          href={isoUrl}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-fd-primary px-6 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
        >
          <DownloadIcon className="h-4 w-4" />
          {d.downloadButton}
        </a>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
          {d.fileDetails}
        </h2>
        <dl className="divide-y divide-fd-border rounded-lg border border-fd-border text-sm">
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="shrink-0 text-fd-muted-foreground">{d.filename}</dt>
            {/* Release image names are long enough to wrap on a phone, so the
                value breaks anywhere rather than pushing into its label. */}
            <dd className="break-all text-right font-mono">{filename}</dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-fd-muted-foreground">{d.architecture}</dt>
            <dd className="font-mono">amd64</dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-fd-muted-foreground">{d.type}</dt>
            <dd>{d.typeValue}</dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-fd-muted-foreground">{d.releaseType}</dt>
            <dd>{releaseValue}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-2.5">
            <dt className="shrink-0 text-fd-muted-foreground">{d.checksum}</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <a
                href={sha256sumUrl}
                className="flex shrink-0 items-center gap-1 rounded border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                download
              >
                <DownloadIcon className="h-3 w-3" />
                <span>Download</span>
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-fd-muted-foreground">
          {d.checksumNote}
        </p>
      </div>

      {zsync && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground">
            {d.zsync}
          </h2>
          <p className="text-sm text-fd-muted-foreground">{d.zsyncNote}</p>
          {/* The wiki's own code block, so the command gets the same copy
              button - and scrolls in place rather than wrapping mid-URL. */}
          <CodeBlock className="mt-3">
            {/* The viewport only pads top and bottom - in the wiki the sides
                are padded by the highlighted line itself, which plain text
                has none of. */}
            <Pre>
              <code className="px-4">zsync {zsyncUrl(isoUrl)}</code>
            </Pre>
          </CodeBlock>
        </div>
      )}
    </>
  )
}

// Stands in for the download card while the release listing is read, sized
// like it so the page doesn't jump when the real one arrives.
function RollingPending({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 rounded-xl border border-fd-border bg-fd-card p-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-fd-primary border-t-transparent" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium">{message}</p>
          <div className="h-3 w-2/3 animate-pulse rounded bg-fd-muted" />
        </div>
      </div>
      <div className="mt-5 h-10 w-full animate-pulse rounded-md bg-fd-muted" />
    </div>
  )
}

function Download() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)
  const d = t.downloadPage
  const rolling = useRollingRelease()

  const [tab, setTab] = useState<'rolling' | 'development'>('rolling')

  const tabs = [
    { id: 'rolling' as const, label: d.rollingTab },
    { id: 'development' as const, label: d.developmentTab },
  ]

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-16">
        <h1 className="text-3xl font-bold">{d.title}</h1>
        <p className="mt-3 text-fd-muted-foreground">{d.subtitle}</p>

        <div
          role="tablist"
          className="mt-8 flex gap-1 border-b border-fd-border"
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              // The selected tab carries the underline down onto the border,
              // so the panel below reads as hanging off it.
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === id
                  ? 'border-fd-primary text-fd-foreground'
                  : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'rolling' ? (
          rolling ? (
            <ReleasePanel
              d={d}
              isoUrl={rolling.isoUrl}
              sha256sumUrl={rolling.sha256sumUrl}
              releaseValue={d.rollingReleaseValue}
            />
          ) : (
            <RollingPending message={d.rollingChecking} />
          )
        ) : (
          <ReleasePanel
            d={d}
            isoUrl={DEVELOPMENT_ISO_URL}
            sha256sumUrl={`${DEVELOPMENT_ISO_URL}.sha256sum`}
            releaseValue={d.releaseTypeValue}
            warning={d.dailyBuildWarning}
            zsync
          />
        )}
      </main>
      <SiteFooter lang={lang} />
    </HomeLayout>
  )
}
