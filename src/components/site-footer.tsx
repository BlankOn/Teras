import { ExternalLink } from 'lucide-react'

/*
 * The BlankOn Foundation footer, copied from blankon.id so the two sites end
 * the same way. Every entry still points at the foundation's own page: the
 * links that are relative over there are absolute here, since this is a
 * different host.
 */

const FOUNDATION = 'https://blankon.id'

type Label = { id: string; en: string }

// `path` is a page on blankon.id, which exists per language; `url` is an
// address that is the same whatever language the reader is in; `local` is a
// page on this site, so it stays in the tab.
type FooterLink = {
  label: Label
  path?: string
  url?: string
  local?: string
  // Another site, but one the top bar treats as part of the project, so it
  // navigates in place rather than opening a tab.
  sameTab?: boolean
}

const SECTIONS: Array<{ title: Label; links: Array<FooterLink> }> = [
  {
    title: { id: 'Yayasan', en: 'Foundation' },
    links: [
      {
        label: { id: 'BlankOn Foundation', en: 'BlankOn Foundation' },
        url: FOUNDATION,
      },
      {
        label: { id: 'Legal & Trademark', en: 'Legal & Trademark' },
        path: 'legal',
      },
      { label: { id: 'Lisensi', en: 'License' }, path: 'license' },
      {
        label: { id: 'Syarat & Ketentuan', en: 'Terms & Conditions' },
        path: 'terms-and-conditions',
      },
      {
        label: { id: 'Sponsorship', en: 'Sponsorship' },
        path: 'sponsorship',
      },
      { label: { id: 'Donasi', en: 'Donate' }, path: 'donate' },
      {
        label: { id: 'Code of Conduct', en: 'Code of Conduct' },
        path: 'code-of-conduct',
      },
      { label: { id: 'Kebijakan AI', en: 'AI Policy' }, path: 'ai-policy' },
    ],
  },
  {
    title: { id: 'Referensi', en: 'Resources' },
    links: [
      // The rest of what the top bar carries: the wiki, and everything under
      // its Development menu.
      { label: { id: 'Wiki', en: 'Wiki' }, local: 'wiki/' },
      { label: { id: 'Tim', en: 'Team' }, local: 'team' },
      {
        label: { id: 'IRGSH', en: 'IRGSH' },
        url: 'https://irgsh.blankonlinux.id/',
        sameTab: true,
      },
      {
        label: { id: 'Packages', en: 'Packages' },
        url: 'https://packages.blankonlinux.id/',
        sameTab: true,
      },
      {
        label: { id: 'Security', en: 'Security' },
        url: 'https://security.blankonlinux.id/',
        sameTab: true,
      },
      {
        label: { id: 'Jahitan', en: 'Jahitan' },
        url: 'https://jahitan.blankonlinux.id/',
      },
      {
        label: { id: 'Arsip', en: 'Arsip' },
        url: 'https://arsip.blankonlinux.id/',
      },
      {
        label: { id: 'Arsip Dev', en: 'Arsip Dev' },
        url: 'https://arsip-dev.blankonlinux.id/',
      },
      {
        label: { id: 'Github', en: 'Github' },
        url: 'https://github.com/blankon',
      },
      {
        label: { id: 'Lokakarya', en: 'Lokakarya' },
        url: 'https://www.youtube.com/@blankonlinux_official',
      },
    ],
  },
  {
    title: { id: 'Sosial Media', en: 'Social Media' },
    links: [
      {
        label: { id: 'X / Twitter', en: 'X / Twitter' },
        url: 'https://x.com/BlankOnLinux',
      },
      {
        label: { id: 'Facebook', en: 'Facebook' },
        url: 'https://www.facebook.com/blankon.linux',
      },
      {
        label: { id: 'Instagram', en: 'Instagram' },
        url: 'https://www.instagram.com/blankonlinux/',
      },
      {
        label: { id: 'Telegram', en: 'Telegram' },
        url: 'https://t.me/BlankOnLinux',
      },
    ],
  },
]

export default function SiteFooter({ lang }: { lang: string }) {
  const pick = (label: Label) => label[lang === 'id' ? 'id' : 'en']

  return (
    <footer className="border-t border-fd-border bg-fd-background py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {SECTIONS.map((section) => (
            <div key={section.title.en}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fd-foreground">
                {pick(section.title)}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  // Only what leaves the project opens in a new tab, and only
                  // those carry the mark the top bar uses for it.
                  const opensTab = !link.local && !link.sameTab

                  return (
                    <li key={link.label.en}>
                      <a
                        href={
                          link.local
                            ? `/${lang}/${link.local}`
                            : (link.url ?? `${FOUNDATION}/${lang}/${link.path}`)
                        }
                        {...(opensTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                      >
                        {pick(link.label)}
                        {opensTab && (
                          <ExternalLink
                            className="size-3.5 shrink-0 text-fd-muted-foreground/70"
                            aria-hidden
                          />
                        )}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
