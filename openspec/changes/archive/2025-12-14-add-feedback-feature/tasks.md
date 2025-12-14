## 1. GitHub Setup

- [ ] 1.1 Create GitHub App in BlankOn organization with Discussions read/write permission
- [ ] 1.2 Install GitHub App on BlankOn/Teras repository
- [ ] 1.3 Create "Docs Feedback" category in GitHub Discussions for BlankOn/Teras
- [ ] 1.4 Document GitHub App setup steps in README or separate guide

## 2. Environment Configuration

- [ ] 2.1 Add `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` to local `.dev.vars` file
- [ ] 2.2 Add environment variables to Cloudflare Workers secrets

## 3. Dependencies

- [x] 3.1 Install Fumadocs feedback component: `npx @fumadocs/cli@latest add feedback`
- [x] 3.2 Install octokit: `npm install octokit`

## 4. Implementation

- [x] 4.1 Create `src/lib/github.ts` with GitHub App authentication and `onRateAction` server function
- [x] 4.2 Update `src/components/feedback.tsx` (created by CLI) to use TanStack Start server function pattern
- [x] 4.3 Add `FeedbackProvider` and `FeedbackFromContext` components using React Context pattern
- [x] 4.4 Add Feedback component to `src/routes/$lang/docs/$.tsx` inside DocsPage using context
- [x] 4.5 Add Feedback component to `src/routes/$lang/dev/$.tsx` inside DocsPage using context

## 5. Internationalization

- [x] 5.1 Add Indonesian translations for feedback UI text in `src/lib/layout.shared.tsx`
- [x] 5.2 Add English translations for feedback UI text in `src/lib/layout.shared.tsx`
- [x] 5.3 Pass translations to Feedback component based on current locale

## 6. Testing

- [ ] 6.1 Test feedback submission creates new Discussion for new page URL
- [ ] 6.2 Test feedback submission adds comment to existing Discussion for same page URL
- [ ] 6.3 Test error handling when GitHub credentials are missing
- [ ] 6.4 Test Feedback component renders correctly on docs pages
- [ ] 6.5 Test Feedback component renders correctly on dev wiki pages
- [ ] 6.6 Test i18n translations display correctly in both languages

## 7. Documentation

- [ ] 7.1 Update README with feedback feature description
- [ ] 7.2 Document required environment variables

## 8. Deployment

- [ ] 8.1 Deploy to preview/staging environment
- [ ] 8.2 Verify end-to-end feedback flow in staging
- [ ] 8.3 Deploy to production
