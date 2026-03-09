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
        <section className="flex flex-col items-center justify-center px-4 pb-8 pt-24 text-center">
          <img
            src="/blankon-revival-project.png"
            alt="BlankOn Revival Project"
            className="mb-8 h-56 w-auto"
          />
          <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground">
            {t.homepage.heroTagline}
          </p>
        </section>

        {/* About Section */}
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-0">
          <p className="text-center text-fd-muted-foreground">
            {t.homepage.aboutDescription}
          </p>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.faqTitle}
          </h2>
          <div className="space-y-2">
            <FAQItem question={t.homepage.faq.q2} answer={t.homepage.faq.a2} />
            <FAQItem question={t.homepage.faq.q3} answer={t.homepage.faq.a3} />
            <FAQItem question={t.homepage.faq.q4} answer={t.homepage.faq.a4} />
            <FAQItem question={t.homepage.faq.q5} answer={t.homepage.faq.a5} />
            <FAQItem question={t.homepage.faq.q6} answer={t.homepage.faq.a6} />
            <FAQItem question={t.homepage.faq.q7} answer={t.homepage.faq.a7} />
            <FAQItem question={t.homepage.faq.q8} answer={t.homepage.faq.a8} />
            <FAQItem question={t.homepage.faq.q9} answer={t.homepage.faq.a9} />
          </div>
        </section>

        {/* Updates Section */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            {t.homepage.updatesTitle}
          </h2>
          <ol className="relative border-s border-fd-border">
            {t.homepage.updates.map((item) => (
              <li key={item.date} className="mb-8 ms-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-fd-background bg-fd-muted-foreground" />
                <time className="mb-1 text-sm font-normal text-fd-muted-foreground">
                  {item.date}
                </time>
                <p className="mt-1 text-base text-fd-foreground">
                  {item.text}
                  {item.url && (
                    <>
                      {' '}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fd-primary underline underline-offset-4 hover:opacity-80"
                      >
                        {item.url}
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
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
        <p className="px-4 pb-4 pt-3 text-fd-muted-foreground">{answer}</p>
      </div>
    </div>
  )
}
