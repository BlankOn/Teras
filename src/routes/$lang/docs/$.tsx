import { createFileRoute, notFound, useLocation } from '@tanstack/react-router'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { createServerFn } from '@tanstack/react-start'
import browserCollections from 'fumadocs-mdx:collections/browser'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import { source } from '@/lib/source'
import { Mermaid } from '@/components/mdx/mermaid'
import { FeedbackFromContext, FeedbackProvider } from '@/components/feedback'

export const Route = createFileRoute('/$lang/docs/$')({
  component: Page,
  loader: async ({ params }) => {
    const data = await serverLoader({
      data: {
        slugs: params._splat?.split('/') ?? [],
        lang: params.lang,
      },
    })
    await clientLoader.preload(data.path)
    return data
  },
})

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((params: { slugs: Array<string>; lang: string }) => params)
  .handler(async ({ data: { slugs, lang } }) => {
    const page = source.getPage(slugs, lang)
    if (!page) throw notFound()

    return {
      path: page.path,
      pageTree: await source.serializePageTree(source.getPageTree(lang)),
    }
  })

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
              Mermaid,
            }}
          />
        </DocsBody>
        <FeedbackFromContext />
      </DocsPage>
    )
  },
})

function Page() {
  const { lang } = Route.useParams()
  const data = Route.useLoaderData()
  const { pageTree } = useFumadocsLoader(data)
  const Content = clientLoader.getComponent(data.path)
  const location = useLocation()
  const t = getTranslations(lang)

  return (
    <FeedbackProvider url={location.pathname} translations={t.feedback}>
      <DocsLayout {...baseOptions(lang)} tree={pageTree}>
        <Content />
      </DocsLayout>
    </FeedbackProvider>
  )
}
