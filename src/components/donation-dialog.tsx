import {
  Check,
  CircleCheck,
  Copy,
  Heart,
  Landmark,
  QrCode,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { getTranslations } from '@/lib/layout.shared'

type DonationStrings = ReturnType<
  typeof getTranslations
>['downloadPage']['donation']

// The foundation's own donate page is the source of these details; keep them
// in step with https://blankon.id/en/donate.
const BNI_ACCOUNT_NUMBER = '6111622231'
const BNI_ACCOUNT_OWNER = 'BlankOn Penggiat Sumber Terbuka Yayasan'
const BNI_SWIFT = 'BNINIDJA'
const CONFIRM_EMAIL = 'humas@blankon.id'

function CopyButton({ value, s }: { value: string; s: DonationStrings }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          .writeText(value)
          .then(() => setCopied(true))
          .catch(() => {})
      }}
      className="flex shrink-0 items-center gap-1 rounded border border-fd-border px-2 py-0.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      <span aria-live="polite">{copied ? s.copied : s.copy}</span>
    </button>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <dt className="shrink-0 text-fd-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-right">{children}</dd>
    </div>
  )
}

// Asks for a donation once the ISO is on its way. The download is never held
// back behind it: the link has already done its job by the time this opens.
export function DonationDialog({
  open,
  onClose,
  lang,
  s,
}: {
  open: boolean
  onClose: () => void
  lang: string
  s: DonationStrings
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [method, setMethod] = useState<'qris' | 'bank'>('qris')

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const [confirmBefore, confirmAfter] = s.confirm.split('{email}')
  const methods = [
    { id: 'qris' as const, label: s.qrisTab, Icon: QrCode },
    { id: 'bank' as const, label: s.bankTab, Icon: Landmark },
  ]

  return (
    <dialog
      ref={ref}
      aria-labelledby="donation-title"
      // Esc and the close button both land here, so state stays in step.
      onClose={onClose}
      // A click on the backdrop reaches the dialog element itself.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-fd-border bg-fd-background p-0 text-fd-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={s.close}
          className="absolute right-3 top-3 rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* First confirm the download is on its way, then make the ask. */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-8 ring-green-500/5">
            <CircleCheck className="h-7 w-7 text-green-600 dark:text-green-500" />
          </div>
          <h2 id="donation-title" className="mt-4 text-xl font-semibold">
            {s.started}
          </h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">{s.body}</p>
          <h3 className="mt-5 flex items-center gap-2 text-base font-semibold">
            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
            {s.title}
          </h3>
        </div>

        <div role="tablist" className="mt-3 grid grid-cols-2 gap-2">
          {methods.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={method === id}
              onClick={() => setMethod(id)}
              // Filled for the chosen method, outlined for the other, so the
              // choice reads the same in light and dark mode.
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                method === id
                  ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
                  : 'border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {method === 'qris' ? (
          <div className="mt-4 flex justify-center">
            {/* The code is printed black on white; it stays on white in dark
                mode so every scanner can read it. */}
            <div className="rounded-xl bg-white p-3">
              <img
                src="/qris-blankon-foundation.png"
                alt={s.qrisAlt}
                width={500}
                height={500}
                className="h-auto w-52"
              />
            </div>
          </div>
        ) : (
          <dl className="mt-4 divide-y divide-fd-border rounded-lg border border-fd-border text-sm">
            <Detail label={s.bank}>BNI (Bank Negara Indonesia)</Detail>
            <Detail label={s.swift}>
              <span className="font-mono">{BNI_SWIFT}</span>
            </Detail>
            <Detail label={s.accountOwner}>{BNI_ACCOUNT_OWNER}</Detail>
            <Detail label={s.accountNumber}>
              <span className="font-mono font-semibold">
                {BNI_ACCOUNT_NUMBER}
              </span>
              <CopyButton value={BNI_ACCOUNT_NUMBER} s={s} />
            </Detail>
          </dl>
        )}

        <p className="mt-4 text-center text-xs text-fd-muted-foreground">
          {confirmBefore}
          <a
            href={`mailto:${CONFIRM_EMAIL}`}
            className="font-medium text-fd-foreground underline underline-offset-2"
          >
            {CONFIRM_EMAIL}
          </a>
          {confirmAfter}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <a
            href={`https://blankon.id/${lang}/donate`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            <Heart className="h-4 w-4 shrink-0" />
            {s.moreWays}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-fd-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            {s.later}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-fd-muted-foreground">
          {s.noPressure}
        </p>
      </div>
    </dialog>
  )
}
