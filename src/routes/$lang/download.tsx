import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'

export const Route = createFileRoute('/$lang/download')({ component: Download })

// The rolling release is the one to hand most people; the daily stitch is the
// development build, and carries the warning that goes with it.
const ROLLING_ISO_URL =
  'http://jahitan.blankonlinux.id/releases/current/blankon-live-image-amd64.hybrid.iso'
const DEVELOPMENT_ISO_URL =
  'http://jahitan.blankonlinux.id/harian/current/blankon-live-image-amd64.hybrid.iso'
const ISO_FILENAME = 'blankon-live-image-amd64.hybrid.iso'

const sha256sumUrl = (isoUrl: string) => `${isoUrl}.sha256sum`

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

function ScreenshotLightbox() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // Square corners: a radius here clips the screenshot's own corners.
        className="mt-8 w-full cursor-zoom-in overflow-hidden border border-fd-border focus:outline-none"
      >
        <img
          src="/screenshot.png"
          alt="BlankOn screenshot"
          className="w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src="/screenshot.png"
            alt="BlankOn screenshot"
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  )
}

// The download card and its file details. Both tabs are the same panel, only
// the image they point at - and the warning - differ.
function ReleasePanel({
  d,
  isoUrl,
  releaseValue,
  warning,
}: {
  d: ReturnType<typeof getTranslations>['downloadPage']
  isoUrl: string
  releaseValue: string
  warning?: string
}) {
  return (
    <>
      {warning && (
        <div className="mt-6 space-y-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300">
          <p>{warning}</p>
          <p>{d.dailyBuildContribute}</p>
          <p>{d.dailyBuildRepo}</p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-fd-border bg-fd-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-2xl">
            💿
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-medium">
              {ISO_FILENAME}
            </p>
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
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-fd-muted-foreground">{d.filename}</dt>
            <dd className="font-mono">{ISO_FILENAME}</dd>
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
                href={sha256sumUrl(isoUrl)}
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
    </>
  )
}

function Download() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)
  const d = t.downloadPage

  const [tab, setTab] = useState<'rolling' | 'development'>('rolling')

  const tabs = [
    { id: 'rolling' as const, label: d.rollingTab },
    { id: 'development' as const, label: d.developmentTab },
  ]

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16">
        <h1 className="text-3xl font-bold">{d.title}</h1>
        <p className="mt-3 text-fd-muted-foreground">{d.subtitle}</p>

        <ScreenshotLightbox />

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
          <ReleasePanel
            d={d}
            isoUrl={ROLLING_ISO_URL}
            releaseValue={d.rollingReleaseValue}
          />
        ) : (
          <ReleasePanel
            d={d}
            isoUrl={DEVELOPMENT_ISO_URL}
            releaseValue={d.releaseTypeValue}
            warning={d.dailyBuildWarning}
          />
        )}

        <div className="mt-10 border-t border-fd-border pt-6 text-sm text-fd-muted-foreground">
          {d.moreInfo}{' '}
          <a
            href={`/${lang}/wiki`}
            className="font-medium text-fd-primary underline-offset-4 hover:underline"
          >
            {d.wikiLink}
          </a>
        </div>
      </main>
    </HomeLayout>
  )
}
