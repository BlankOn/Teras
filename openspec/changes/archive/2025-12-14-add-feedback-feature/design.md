## Context

The Teras documentation site needs a way to collect user feedback on documentation quality. Users should be able to rate pages (positive/negative) and optionally provide detailed feedback messages.

**Stakeholders:**

- Documentation readers (BlankOn users)
- Documentation maintainers (BlankOn developers)
- Community contributors

**Constraints:**

- Must work with Cloudflare Workers edge runtime
- Must support i18n (Indonesian and English)
- Should not require additional paid services
- Feedback must be publicly visible for transparency

## Goals / Non-Goals

**Goals:**

- Allow users to rate documentation pages (thumbs up/down)
- Collect optional text feedback with ratings
- Store feedback in GitHub Discussions for public visibility
- Support both docs and dev wiki sections
- Provide i18n support for feedback UI

**Non-Goals:**

- Real-time analytics dashboard
- Anonymous feedback (feedback goes to public GitHub Discussion)
- Feedback moderation within the app (handled via GitHub)
- Integration with external analytics services (PostHog, etc.)

## Decisions

### Decision 1: Use Fumadocs Feedback Component

**What:** Install the Fumadocs feedback component via CLI (`npx @fumadocs/cli@latest add feedback`)

**Why:**

- Consistent with existing Fumadocs UI components
- Pre-built accessible UI with proper styling
- Handles rating state and form submission
- Reduces custom code maintenance

**Alternatives considered:**

- Custom feedback component: More flexibility but more maintenance burden
- Third-party widget (e.g., Canny): Adds external dependency and potential costs

### Decision 2: GitHub Discussions as Feedback Destination

**What:** Store feedback in GitHub Discussions using a dedicated "Docs Feedback" category

**Why:**

- No additional infrastructure required
- Feedback is publicly searchable and discussable
- Community can participate in feedback threads
- Integrates with existing GitHub workflow
- Free for public repositories

**Alternatives considered:**

- GitHub Issues: Creates noise in issue tracker, harder to filter
- Database (D1/KV): Requires additional infrastructure, not public
- External service (PostHog): Adds dependency, potential costs, data privacy concerns

### Decision 3: GitHub App Authentication

**What:** Use a GitHub App with installation token for API access

**Why:**

- More secure than personal access tokens
- Fine-grained permissions (only discussions access needed)
- Not tied to individual user accounts
- Can be installed on the BlankOn organization

**Alternatives considered:**

- Personal Access Token: Tied to individual, security risk if leaked
- OAuth App: Requires user login, not suitable for server-side feedback

### Decision 4: Feedback Aggregation by URL

**What:** Create one Discussion per documentation page URL, with feedback as comments

**Why:**

- Keeps related feedback together
- Easy to find all feedback for a specific page
- Reduces Discussion clutter
- Matches Fumadocs reference implementation

**Implementation:**

1. First feedback for a URL creates a new Discussion with title "Feedback for {url}"
2. Subsequent feedback for same URL adds comments to existing Discussion
3. Each comment includes opinion (positive/negative) and message

### Decision 5: Server Action Implementation

**What:** Use TanStack Start `createServerFn` for the feedback action

**Why:**

- Consistent with existing server function patterns in the codebase
- Keeps GitHub App credentials secure on server
- Supports edge runtime (Cloudflare Workers)

**Implementation pattern:**

```typescript
const onRateAction = createServerFn({ method: 'POST' })
  .inputValidator(...)
  .handler(async ({ data }) => {
    // GitHub API calls
  })
```

### Decision 6: React Context for Feedback Props

**What:** Use React Context to pass `url` and `translations` to the Feedback component inside DocsPage

**Why:**

In TanStack Start, the `clientLoader` must be defined at module scope to support `preload()` in the route loader. However, runtime values like `lang` and `url` are only available inside the `Page` component. This creates a challenge: we need to render `<Feedback>` inside `<DocsPage>` (which is rendered by `clientLoader`) but with props that are only available at runtime.

React Context bridges this gap:

1. `FeedbackProvider` wraps the layout in `Page()` where `lang` and `url` are available
2. `FeedbackFromContext` is placed inside `DocsPage` (in `clientLoader`) and reads from context
3. This preserves the module-scope `clientLoader` for preloading while providing runtime values

**Alternatives considered:**

- Move `clientLoader` inside `Page` component: Would lose `preload()` capability, hurting performance
- Pass props via global state: Adds unnecessary complexity
- Use URL parsing inside Feedback: Would couple component to router implementation

**Implementation pattern:**

```typescript
// In feedback.tsx
const FeedbackContext = createContext<FeedbackProps | null>(null)

export function FeedbackProvider({ children, ...props }) {
  return <FeedbackContext.Provider value={props}>{children}</FeedbackContext.Provider>
}

export function FeedbackFromContext() {
  const props = useContext(FeedbackContext)
  return <Feedback {...props} />
}

// In route file
const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage toc={toc}>
        <DocsBody><MDX /></DocsBody>
        <FeedbackFromContext />  {/* Reads from context */}
      </DocsPage>
    )
  },
})

function Page() {
  return (
    <FeedbackProvider url={location.pathname} translations={t.feedback}>
      <DocsLayout><Content /></DocsLayout>
    </FeedbackProvider>
  )
}
```

## Risks / Trade-offs

### Risk 1: GitHub API Rate Limits

- **Risk:** High feedback volume could hit GitHub API rate limits
- **Mitigation:** GitHub App tokens have 5000 requests/hour, sufficient for documentation feedback
- **Monitoring:** Log API errors, alert on rate limit responses

### Risk 2: GitHub App Credential Security

- **Risk:** Private key exposure could compromise the GitHub App
- **Mitigation:** Store credentials as environment secrets in Cloudflare, never commit to repository
- **Recovery:** Revoke and regenerate credentials if compromised

### Risk 3: Feedback Spam

- **Risk:** Public feedback form could attract spam
- **Mitigation:** Feedback goes to GitHub Discussions with moderation capabilities; consider rate limiting per session in future

### Risk 4: Edge Runtime Compatibility

- **Risk:** Octokit or GitHub App authentication may not work on Cloudflare Workers
- **Mitigation:** Test on Cloudflare Workers during development; Octokit is documented to support edge runtimes
- **Fallback:** Use fetch with manual JWT generation if needed

## Migration Plan

### Phase 1: Setup (No user-facing changes)

1. Create GitHub App in BlankOn organization
2. Configure app permissions (Discussions: read/write)
3. Install app on BlankOn/Teras repository
4. Create "Docs Feedback" category in GitHub Discussions
5. Add environment variables to Cloudflare Workers

### Phase 2: Implementation

1. Install Fumadocs feedback component
2. Implement GitHub integration server action
3. Add Feedback component to docs and dev routes
4. Add i18n translations

### Phase 3: Deployment

1. Deploy to staging/preview environment
2. Test feedback submission end-to-end
3. Deploy to production

### Rollback

- Feedback component can be removed without data loss
- Existing feedback remains in GitHub Discussions
- No database migrations to reverse

## Open Questions

1. **Discussion category naming:** Should it be "Docs Feedback" (English) or "Masukan Dokumentasi" (Indonesian)? Recommendation: Use English since GitHub UI is primarily in English.

2. **Feedback success message:** Should we show a link to the created GitHub Discussion? The Fumadocs component supports returning `githubUrl` in the action response. Recommendation: Yes, allows users to follow up on their feedback.

3. **Rate limiting:** Should we implement client-side rate limiting to prevent rapid submissions? Recommendation: Start without it, add if spam becomes an issue.
