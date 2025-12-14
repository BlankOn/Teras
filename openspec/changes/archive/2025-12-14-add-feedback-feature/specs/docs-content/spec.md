## ADDED Requirements

### Requirement: Feedback Component

Documentation pages SHALL display a feedback component allowing users to rate content quality and provide optional feedback messages.

#### Scenario: Feedback component display

- **WHEN** a documentation page is rendered
- **THEN** a Feedback component is displayed at the bottom of the page content, above the page navigation
- **AND** the component shows rating options (positive/negative)
- **AND** the component receives URL and translations via React Context (to support module-scope clientLoader)

#### Scenario: User submits positive feedback without message

- **WHEN** user clicks the positive rating button
- **AND** user does not enter a message
- **THEN** feedback is submitted with opinion "positive" and empty message
- **AND** a success state is displayed

#### Scenario: User submits negative feedback with message

- **WHEN** user clicks the negative rating button
- **AND** user enters a feedback message
- **AND** user submits the feedback
- **THEN** feedback is submitted with opinion "negative" and the message
- **AND** a success state is displayed

#### Scenario: Feedback component in dev wiki

- **WHEN** a developer wiki page is rendered at `/$lang/dev/*`
- **THEN** the same Feedback component is displayed at the bottom of the page content, above the page navigation
- **AND** the component receives URL and translations via React Context

### Requirement: GitHub Discussion Feedback Storage

User feedback SHALL be stored in GitHub Discussions within the BlankOn/Teras repository.

#### Scenario: First feedback for a page creates Discussion

- **WHEN** feedback is submitted for a page URL that has no existing Discussion
- **THEN** a new Discussion is created in the "Docs Feedback" category
- **AND** the Discussion title is "Feedback for {url}"
- **AND** the Discussion body contains the opinion and message

#### Scenario: Subsequent feedback adds comment to existing Discussion

- **WHEN** feedback is submitted for a page URL that has an existing Discussion
- **THEN** a new comment is added to the existing Discussion
- **AND** the comment contains the opinion and message

#### Scenario: Feedback response includes Discussion URL

- **WHEN** feedback is successfully submitted
- **THEN** the action response includes the GitHub Discussion URL
- **AND** the UI can optionally display a link to the Discussion

### Requirement: GitHub App Authentication

The feedback server action SHALL authenticate with GitHub using a GitHub App installation token.

#### Scenario: Valid GitHub App credentials

- **WHEN** `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` environment variables are set
- **THEN** the server action can authenticate with GitHub API
- **AND** the app has permission to create and comment on Discussions

#### Scenario: Missing GitHub App credentials

- **WHEN** GitHub App credentials are not configured
- **THEN** the server action throws an error with a descriptive message
- **AND** the error indicates that the feedback feature is not configured

### Requirement: Feedback i18n Support

Feedback UI text SHALL be translated for all supported languages.

#### Scenario: Indonesian feedback UI

- **WHEN** the page language is Indonesian (`id`)
- **THEN** feedback UI displays Indonesian text
- **AND** rating prompt, success message, and error messages are in Indonesian

#### Scenario: English feedback UI

- **WHEN** the page language is English (`en`)
- **THEN** feedback UI displays English text
- **AND** rating prompt, success message, and error messages are in English
