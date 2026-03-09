import { createFileRoute, notFound } from '@tanstack/react-router'
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
import { baseOptions } from '@/lib/layout.shared'
import { wikiSource } from '@/lib/source'
import { Mermaid } from '@/components/mdx/mermaid'
import type { PageTree } from 'fumadocs-core/server'

function transformNodes(nodes: PageTree.Node[]): PageTree.Node[] {
  return nodes.flatMap((node) => {
    if (node.type === 'folder') {
      const children = transformNodes(node.children)
      if (children.length === 0) {
        return node.index ? [{ ...node.index }] : []
      }
      return [{ ...node, children }]
    }
    return [node]
  })
}

function collapseEmptyFolders(tree: PageTree.Root): PageTree.Root {
  return { ...tree, children: transformNodes(tree.children) }
}

export const Route = createFileRoute('/$lang/wiki/$')({
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
    const page = wikiSource.getPage(slugs, lang)
    if (!page) throw notFound()

    return {
      path: page.path,
      pageTree: await wikiSource.serializePageTree(wikiSource.getPageTree(lang)),
    }
  })

const clientLoader = browserCollections.wiki.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    const editPath = frontmatter.editPath

    return (
      <DocsPage toc={toc}>
        <div className="flex items-start justify-between gap-4">
          <DocsTitle>{frontmatter.title}</DocsTitle>
          {editPath && (
            <a
              href={`https://github.com/BlankOn/revival/edit/main/${editPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 shrink-0 rounded-md border border-fd-border px-2.5 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              Edit
            </a>
          )}
        </div>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX
            components={{
              ...defaultMdxComponents,
              Mermaid,
            }}
          />
        </DocsBody>
      </DocsPage>
    )
  },
})

function Page() {
  const { lang } = Route.useParams()
  const data = Route.useLoaderData()
  const { pageTree } = useFumadocsLoader(data)
  const Content = clientLoader.getComponent(data.path)

  return (
    <DocsLayout {...baseOptions(lang)} tree={collapseEmptyFolders(pageTree)}>
      <Content />
    </DocsLayout>
  )
}
