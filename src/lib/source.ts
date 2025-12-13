import { dev, docs } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { i18n } from '@/lib/i18n'

export const source = loader({
  i18n,
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})

export const devSource = loader({
  i18n,
  baseUrl: '/dev',
  source: dev.toFumadocsSource(),
})
