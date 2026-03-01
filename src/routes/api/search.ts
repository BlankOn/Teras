import { createFileRoute } from '@tanstack/react-router'
import { createI18nSearchAPI } from 'fumadocs-core/search/server'
import { wikiSource } from '@/lib/source'
import { i18n } from '@/lib/i18n'

const server = createI18nSearchAPI('advanced', {
  i18n,
  localeMap: {
    id: 'indonesian',
    en: 'english',
  },
  indexes: i18n.languages.flatMap((lang) => {
    const wikiPages = wikiSource.getPages(lang)
    return wikiPages.map((page) => ({
      locale: lang,
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    }))
  }),
})

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
})
