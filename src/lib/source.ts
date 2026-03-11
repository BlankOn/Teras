import { wiki } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { i18n } from '@/lib/i18n'

export const wikiSource = loader({
  i18n,
  baseUrl: '/wiki',
  source: wiki.toFumadocsSource(),
})
