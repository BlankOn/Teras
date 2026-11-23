import { createFileRoute, notFound } from '@tanstack/react-router'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
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
import type { PageTree } from 'fumadocs-core/server'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import { wikiSource } from '@/lib/source'
import { staticServerFnMiddleware } from '@/lib/static-server-fn'
import { Mermaid } from '@/components/mdx/mermaid'

function transformNodes(nodes: Array<PageTree.Node>): Array<PageTree.Node> {
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
  .middleware([staticServerFnMiddleware])
  .inputValidator((params: { slugs: Array<string>; lang: string }) => params)
  .handler(async ({ data: { slugs, lang } }) => {
    const page = wikiSource.getPage(slugs, lang)
    if (!page) throw notFound()

    return {
      path: page.path,
      pageTree: await wikiSource.serializePageTree(
        wikiSource.getPageTree(lang),
      ),
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
    // The site's own header, exactly as every other page has it, with the
    // docs layout underneath for the sidebar. The header is sticky at h-14,
    // so the docs layout treats it as a banner and pins its sidebar below it.
    <HomeLayout {...baseOptions(lang)}>
      <DocsLayout
        tree={collapseEmptyFolders(pageTree)}
        // The header above already carries the logo, language and theme
        // toggles; the sidebar keeps only the page tree and the wiki search.
        // Its own bar only shows on phones, where it opens the sidebar.
        nav={{ title: getTranslations(lang).wiki, url: `/${lang}/wiki/` }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: true }}
        containerProps={{
          style: { '--fd-banner-height': '3.5rem' } as React.CSSProperties,
        }}
      >
        <Content />
      </DocsLayout>
    </HomeLayout>
  )
}
