import {
  HeadContent,
  Scripts,
  createRootRoute,
  useParams,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { RootProvider } from 'fumadocs-ui/provider/base'
import { TanstackProvider } from 'fumadocs-core/framework/tanstack'
import { defineI18nUI } from 'fumadocs-ui/i18n'
import appCss from '../styles.css?url'
import { i18n } from '@/lib/i18n'

const { provider } = defineI18nUI(i18n, {
  translations: {
    id: {
      displayName: 'Indonesia',
      search: 'Cari dokumentasi',
      searchNoResult: 'Tidak ada hasil',
      toc: 'Daftar Isi',
      tocNoHeadings: 'Tidak ada heading',
      lastUpdate: 'Terakhir diperbarui',
      chooseLanguage: 'Pilih bahasa',
      nextPage: 'Selanjutnya',
      previousPage: 'Sebelumnya',
      chooseTheme: 'Pilih tema',
      editOnGithub: 'Edit di GitHub',
    },
    en: {
      displayName: 'English',
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'BlankOn',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { lang } = useParams({ strict: false })

  return (
    <html lang={lang || 'id'} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <TanstackProvider>
          <RootProvider i18n={provider(lang)}>{children}</RootProvider>
        </TanstackProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
