import { createFileRoute } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { baseOptions, getTranslations } from '@/lib/layout.shared'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/$lang/')({ component: Home })

function Home() {
  const { lang } = Route.useParams()
  const t = getTranslations(lang)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <img
            src="/logo-black.png"
            alt="BlankOn"
            className="mb-8 h-16 w-auto dark:hidden"
          />
          <img
            src="/logo-white.png"
            alt="BlankOn"
            className="mb-8 hidden h-12 w-auto dark:block"
          />
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {t.homepage.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">
            {t.homepage.heroTagline}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`/${lang}/download`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              {t.homepage.downloadIso}
            </a>
            <a
              href={`/${lang}/wiki`}
              className="inline-flex h-10 items-center justify-center rounded-md border border-fd-border bg-fd-background px-6 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              {t.homepage.readDocs}
            </a>
          </div>
        </section>

        {/* About Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-6 text-center text-2xl font-semibold">
            {t.homepage.aboutTitle}
          </h2>
          <p className="text-center text-fd-muted-foreground">
            {t.homepage.aboutDescription}
          </p>
        </section>

        {/* Sponsors Section */}
        <section className="px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.sponsorsTitle}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-12">
            <a
              href="https://nurulfikri.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="/logo-sttnf.png"
                alt="STT Terpadu Nurul Fikri"
                className="h-16 w-auto"
              />
            </a>
            <a
              href="https://www.hostbadak.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src="/logo-hostbadak.png"
                alt="HostBadak"
                className="h-16 w-auto"
              />
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.faqTitle}
          </h2>
          <div className="space-y-2">
            <FAQItem question={t.homepage.faq.q1} answer={t.homepage.faq.a1} />
            <FAQItem question={t.homepage.faq.q2} answer={t.homepage.faq.a2} />
            <FAQItem question={t.homepage.faq.q3} answer={t.homepage.faq.a3} />
            <FAQItem question={t.homepage.faq.q4} answer={t.homepage.faq.a4} />
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-semibold">
              {t.homepage.getInvolvedTitle}
            </h2>
            <p className="mb-8 text-fd-muted-foreground">
              {t.homepage.getInvolvedDescription}
            </p>
            <a
              href="https://t.me/BlankOnLinux"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              {t.homepage.joinTelegram}
            </a>
          </div>
        </section>
      </main>
    </HomeLayout>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-fd-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-fd-accent/50"
      >
        {question}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96' : 'max-h-0',
        )}
      >
        <p className="px-4 pb-4 text-fd-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}
