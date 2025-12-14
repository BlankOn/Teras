# Change: Add Documentation Feedback Feature with GitHub Discussion Integration

## Why

Documentation quality depends on user feedback. Currently, there is no mechanism for users to provide feedback on documentation pages. Integrating a feedback feature allows readers to rate content and share improvement suggestions, helping maintainers identify confusing or incomplete sections.

GitHub Discussions is chosen as the feedback destination because:

- BlankOn already uses GitHub (BlankOn/Teras repository) for source control
- No additional infrastructure or third-party services required
- Feedback is publicly visible and searchable
- Community members can participate in discussions
- Feedback is preserved alongside the codebase

## What Changes

- Add `Feedback` component to documentation pages using Fumadocs CLI scaffold
- Create server action to post feedback to GitHub Discussions via GitHub App
- Add feedback component to both docs (`/$lang/docs/$`) and dev wiki (`/$lang/dev/$`) routes
- Add i18n translations for feedback UI text (Indonesian and English)
- Configure GitHub App authentication for the server action
- Create a "Docs Feedback" category in GitHub Discussions

## Impact

- Affected specs: `docs-content`, `i18n`
- Affected code:
  - `src/components/feedback.tsx` (new)
  - `src/lib/github.ts` (new)
  - `src/routes/$lang/docs/$.tsx`
  - `src/routes/$lang/dev/$.tsx`
  - `src/lib/layout.shared.tsx` (translations)
- New environment variables: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`
- New npm dependency: `octokit`
