import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { i18n } from '@/lib/i18n'

function Logo() {
  return (
    <>
      <img
        src="/logo-black.png"
        alt="BlankOn"
        className="block h-6 w-auto dark:hidden"
      />
      <img
        src="/logo-white.png"
        alt="BlankOn"
        className="hidden h-4 w-auto dark:block"
      />
    </>
  )
}

const translations = {
  id: {
    home: 'Beranda',
    download: 'Unduh',
    docs: 'Panduan Pengguna',
    dev: 'Wiki Pengembangan',
    welcome: 'Selamat datang di BlankOn',
    downloadDesc: 'Halaman unduh BlankOn',
  },
  en: {
    home: 'Home',
    download: 'Download',
    docs: 'User Guide',
    dev: 'Developer Wiki',
    welcome: 'Welcome to BlankOn',
    downloadDesc: 'BlankOn download page',
  },
}

export function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.id
}

export function baseOptions(locale: string): BaseLayoutProps {
  const t = getTranslations(locale)

  return {
    i18n,
    nav: {
      title: <Logo />,
      url: `/${locale}`,
    },
    links: [
      {
        text: t.home,
        url: `/${locale}`,
        active: 'url',
      },
      {
        text: t.download,
        url: `/${locale}/download`,
        active: 'nested-url',
      },
      {
        text: t.docs,
        url: `/${locale}/docs`,
        active: 'nested-url',
      },
      {
        text: t.dev,
        url: `/${locale}/dev`,
        active: 'nested-url',
      },
    ],
  }
}
