import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import { checksum } from 'virtual:checksum'

export const Route = createFileRoute('/$lang/download')({ component: Download })

const ISO_URL =
  'http://jahitan.blankonlinux.id/harian/current/blankon-live-image-amd64.hybrid.iso'
const ISO_FILENAME = 'blankon-live-image-amd64.hybrid.iso'

function ScreenshotLightbox() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 w-full cursor-zoom-in overflow-hidden rounded-xl border border-fd-border focus:outline-none"
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
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  )
}

function Download() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)
  const d = t.downloadPage

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-16">
        <h1 className="text-3xl font-bold">{d.title}</h1>
        <p className="mt-3 text-fd-muted-foreground">{d.subtitle}</p>

        {/* Warning */}
        <div className="mt-6 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-300">
          {d.dailyBuildWarning}
        </div>

        {/* Screenshot */}
        <ScreenshotLightbox />

        {/* Download card */}
        <div className="mt-8 rounded-xl border border-fd-border bg-fd-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-2xl">
              💿
            </div>
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium">{ISO_FILENAME}</p>
              <p className="text-xs text-fd-muted-foreground">{d.typeValue}</p>
            </div>
          </div>

          <a
            href={ISO_URL}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-fd-primary px-6 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v11" />
            </svg>
            {d.downloadButton}
          </a>
        </div>

        {/* File details */}
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
              <dd>{d.releaseTypeValue}</dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="shrink-0 text-fd-muted-foreground">{d.checksum}</dt>
              <dd className="truncate font-mono text-xs">
                {checksum || d.checksumError}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-fd-muted-foreground">{d.checksumNote}</p>
        </div>

        {/* Wiki link */}
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
