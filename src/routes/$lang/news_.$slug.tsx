import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { NewsLang } from '@/lib/news'
import { baseOptions } from '@/lib/layout.shared'
import SiteFooter from '@/components/site-footer'
import { getNewsArticle } from '@/lib/news'

export const Route = createFileRoute('/$lang/news_/$slug')({
  head: ({ params }) => {
    const article = getNewsArticle(params.slug, params.lang as NewsLang)
    const section = params.lang === 'id' ? 'Berita' : 'News'
    const title =
      article?.title ?? articleContent[params.lang as NewsLang].notFoundTitle
    return {
      meta: [{ title: `BlankOn Linux - ${section} - ${title}` }],
    }
  },
  component: NewsArticlePage,
})

const articleContent = {
  id: {
    back: '← Kembali ke Berita',
    copy: 'Salin',
    copied: 'Tersalin',
    closeImage: 'Tutup gambar',
    notFoundTitle: 'Berita Tidak Ditemukan',
    notFoundDescription: 'Berita yang Anda cari tidak tersedia.',
  },
  en: {
    back: '← Back to News',
    copy: 'Copy',
    copied: 'Copied',
    closeImage: 'Close image',
    notFoundTitle: 'News Not Found',
    notFoundDescription:
      'The news article you are looking for is not available.',
  },
}

function formatDate(date: string, lang: string) {
  return new Date(date).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsArticlePage() {
  const { lang, slug } = Route.useParams()
  const content = articleContent[lang as keyof typeof articleContent]
  const article = getNewsArticle(slug, lang as NewsLang)
  const bodyRef = useRef<HTMLElement>(null)
  const [enlarged, setEnlarged] = useState<{ src: string; alt: string } | null>(
    null,
  )
  // A stable object keeps React from resetting the article HTML on re-render,
  // which would drop the copy buttons attached below.
  const articleHtml = useMemo(
    () => ({ __html: article?.html ?? '' }),
    [article],
  )

  // The article body is plain HTML from Markdown, so each code block gets its
  // copy button attached here.
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return

    const buttons = Array.from(body.querySelectorAll('pre')).map((pre) => {
      pre.classList.add('relative')
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = content.copy
      button.className =
        'absolute right-2 top-2 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20'
      button.addEventListener('click', () => {
        void navigator.clipboard.writeText(
          pre.querySelector('code')?.textContent ?? '',
        )
        button.textContent = content.copied
        setTimeout(() => {
          button.textContent = content.copy
        }, 1500)
      })
      pre.appendChild(button)
      return button
    })

    return () => buttons.forEach((button) => button.remove())
  }, [article, content])

  // Article images open in a full-size overlay when clicked.
  const onArticleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof HTMLImageElement) {
      setEnlarged({ src: event.target.src, alt: event.target.alt })
    }
  }

  useEffect(() => {
    if (!enlarged) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEnlarged(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [enlarged])

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col">
        <section className="bg-fd-background py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <Link
              to="/$lang/news"
              params={{ lang }}
              className="mb-8 inline-block font-medium text-blue-600 dark:text-blue-400"
            >
              {content.back}
            </Link>

            {article ? (
              <>
                <p className="mb-2 text-sm text-fd-muted-foreground">
                  {formatDate(article.date, lang)}
                </p>
                <article
                  ref={bodyRef}
                  onClick={onArticleClick}
                  className="[&_img]:cursor-zoom-in wysiwyg dark:wysiwyg-invert max-w-none wysiwyg-th:px-4 wysiwyg-th:py-2 wysiwyg-td:px-4 wysiwyg-td:py-2"
                  dangerouslySetInnerHTML={articleHtml}
                />
              </>
            ) : (
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-fd-foreground">
                  {content.notFoundTitle}
                </h1>
                <p className="text-fd-muted-foreground">
                  {content.notFoundDescription}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      {enlarged && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={enlarged.alt}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
          onClick={() => setEnlarged(null)}
        >
          <img
            src={enlarged.src}
            alt={enlarged.alt}
            className="max-h-full max-w-full rounded-lg shadow-2xl"
          />
          <button
            type="button"
            aria-label={content.closeImage}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-2xl text-white hover:bg-white/20"
          >
            ×
          </button>
        </div>
      )}
      <SiteFooter lang={lang} />
    </HomeLayout>
  )
}
