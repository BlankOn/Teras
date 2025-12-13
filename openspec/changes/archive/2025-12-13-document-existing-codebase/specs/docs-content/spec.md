## ADDED Requirements

### Requirement: Content Collections

The system SHALL define MDX content collections using Fumadocs `defineDocs` in `source.config.ts`.

#### Scenario: Docs collection definition

- **WHEN** the docs collection is configured
- **THEN** it reads from `content/docs/` directory

#### Scenario: Dev collection definition

- **WHEN** the dev collection is configured
- **THEN** it reads from `content/dev/` directory

### Requirement: Content Source Loaders

Each content collection SHALL have a loader with i18n support and a base URL.

#### Scenario: Docs source loader

- **WHEN** the docs source is initialized
- **THEN** it uses the shared i18n configuration
- **AND** has baseUrl of `/docs`

#### Scenario: Dev source loader

- **WHEN** the dev source is initialized
- **THEN** it uses the shared i18n configuration
- **AND** has baseUrl of `/dev`

### Requirement: Page Retrieval

The system SHALL provide methods to retrieve pages by slug array and language.

#### Scenario: Get page by slugs

- **WHEN** `source.getPage(['getting-started'], 'en')` is called
- **THEN** the English "getting-started" page is returned
- **OR** `undefined` if the page does not exist

#### Scenario: Get all pages for language

- **WHEN** `source.getPages('id')` is called
- **THEN** all Indonesian documentation pages are returned

### Requirement: Page Tree Navigation

The system SHALL generate a page tree for sidebar navigation based on content structure.

#### Scenario: Page tree generation

- **WHEN** `source.getPageTree('en')` is called
- **THEN** a hierarchical tree of all English pages is returned
- **AND** the tree can be serialized for client-side use

### Requirement: MDX Frontmatter

Each MDX file SHALL have frontmatter with at least `title` and `description` fields.

#### Scenario: Required frontmatter fields

- **WHEN** an MDX file has frontmatter
- **THEN** `title` field is present and non-empty
- **AND** `description` field is present

### Requirement: Client-Side Content Loading

MDX content SHALL be loaded on the client using `createClientLoader` with preloading support.

#### Scenario: Content preloading

- **WHEN** a documentation route is loaded
- **THEN** `clientLoader.preload(path)` is called during route loading
- **AND** `clientLoader.getComponent(path)` returns the content component

### Requirement: DocsPage Structure

Documentation pages SHALL render using Fumadocs UI components in a consistent structure.

#### Scenario: Page component structure

- **WHEN** an MDX page is rendered
- **THEN** it uses `DocsPage` wrapper with table of contents
- **AND** `DocsTitle` displays the frontmatter title
- **AND** `DocsDescription` displays the frontmatter description
- **AND** `DocsBody` wraps the MDX content

### Requirement: Default MDX Components

MDX content SHALL use default Fumadocs components for code blocks, links, and other elements.

#### Scenario: MDX component mapping

- **WHEN** MDX content is rendered
- **THEN** `defaultMdxComponents` are provided to the MDX component
- **AND** code blocks have syntax highlighting

### Requirement: Table of Contents

Documentation pages SHALL display a table of contents generated from MDX headings.

#### Scenario: TOC generation

- **WHEN** an MDX page with headings is rendered
- **THEN** the `toc` prop contains heading IDs, text, and depth
- **AND** `DocsPage` renders the TOC in a sidebar

### Requirement: 404 Handling

The system SHALL return a 404 error when a requested page does not exist.

#### Scenario: Page not found

- **WHEN** `source.getPage(['nonexistent'], 'en')` returns undefined
- **THEN** the server function throws `notFound()`
- **AND** a 404 page is displayed to the user
