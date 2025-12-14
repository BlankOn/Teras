import { ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react'
import {
  Collapsible,
  CollapsibleContent,
} from 'fumadocs-ui/components/ui/collapsible'
import { cva } from 'class-variance-authority'
import { buttonVariants } from './ui/button'
import type { SyntheticEvent } from 'react'
import { cn } from '@/lib/cn'
import { onRateAction } from '@/lib/github'

const rateButtonVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current',
        false: 'text-fd-muted-foreground',
      },
    },
  },
)

export interface FeedbackData {
  opinion: 'good' | 'bad'
  message: string
}

export interface ActionResponse {
  githubUrl: string
}

interface Result extends FeedbackData {
  response?: ActionResponse
}

export interface FeedbackTranslations {
  question: string
  good: string
  bad: string
  placeholder: string
  submit: string
  thanks: string
  viewOnGithub: string
  submitAgain: string
}

export interface FeedbackProps {
  url: string
  translations: FeedbackTranslations
}

// Context for providing feedback props to nested components
const FeedbackContext = createContext<FeedbackProps | null>(null)

export function FeedbackProvider({
  children,
  ...props
}: FeedbackProps & { children: React.ReactNode }) {
  return (
    <FeedbackContext.Provider value={props}>
      {children}
    </FeedbackContext.Provider>
  )
}

// Component that consumes context - for use inside DocsPage
export function FeedbackFromContext() {
  const props = useContext(FeedbackContext)
  if (!props) {
    throw new Error('FeedbackFromContext must be used within FeedbackProvider')
  }
  return <Feedback {...props} />
}

export function Feedback({ url, translations: t }: FeedbackProps) {
  const [previous, setPrevious] = useState<Result | null>(null)
  const [opinion, setOpinion] = useState<'good' | 'bad' | null>(null)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`)

    if (item === null) return
    setPrevious(JSON.parse(item) as Result)
  }, [url])

  useEffect(() => {
    const key = `docs-feedback-${url}`

    if (previous) localStorage.setItem(key, JSON.stringify(previous))
    else localStorage.removeItem(key)
  }, [previous, url])

  function submit(e?: SyntheticEvent) {
    if (opinion == null) return

    startTransition(async () => {
      const feedback: FeedbackData = {
        opinion,
        message,
      }

      try {
        const response = await onRateAction({
          data: {
            url,
            opinion,
            message,
          },
        })
        setPrevious({
          response,
          ...feedback,
        })
        setMessage('')
        setOpinion(null)
      } catch (error) {
        console.error('Failed to submit feedback:', error)
      }
    })

    e?.preventDefault()
  }

  const activeOpinion = previous?.opinion ?? opinion

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null)
      }}
      className="py-3"
    >
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm font-medium pe-2">{t.question}</p>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'good',
            }),
          )}
          onClick={() => {
            setOpinion('good')
          }}
        >
          <ThumbsUp />
          {t.good}
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'bad',
            }),
          )}
          onClick={() => {
            setOpinion('bad')
          }}
        >
          <ThumbsDown />
          {t.bad}
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="bg-fd-card text-fd-muted-foreground flex flex-col items-center gap-3 rounded-xl px-3 py-6 text-center text-sm">
            <p>{t.thanks}</p>
            <div className="flex flex-row items-center gap-2">
              <a
                href={previous.response?.githubUrl}
                rel="noreferrer noopener"
                target="_blank"
                className={cn(
                  buttonVariants({
                    color: 'primary',
                  }),
                  'text-xs',
                )}
              >
                {t.viewOnGithub}
              </a>

              <button
                className={cn(
                  buttonVariants({
                    color: 'secondary',
                  }),
                  'text-xs',
                )}
                onClick={() => {
                  setOpinion(previous.opinion)
                  setPrevious(null)
                }}
              >
                {t.submitAgain}
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-fd-secondary text-fd-secondary-foreground placeholder:text-fd-muted-foreground resize-none rounded-lg border p-3 focus-visible:outline-none"
              placeholder={t.placeholder}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  submit(e)
                }
              }}
            />
            <button
              type="submit"
              className={cn(buttonVariants({ color: 'outline' }), 'w-fit px-3')}
              disabled={isPending}
            >
              {t.submit}
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
