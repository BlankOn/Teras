# routing Specification

## Purpose

TBD - created by archiving change document-existing-codebase. Update Purpose after archive.

## Requirements

### Requirement: File-Based Routing

The system SHALL use TanStack Router file-based routing with routes defined in `src/routes/`.

#### Scenario: Route file creates corresponding URL

- **WHEN** a file `src/routes/$lang/download.tsx` exists
- **THEN** the URL `/$lang/download` is accessible

#### Scenario: Index route mapping

- **WHEN** a file `src/routes/$lang/index.tsx` exists
- **THEN** the URL `/$lang/` (with trailing slash or without) is accessible

### Requirement: Language-Prefixed Routes

All user-facing routes SHALL be prefixed with `/$lang/` where `$lang` is a supported language code.

#### Scenario: Homepage with language

- **WHEN** user visits `/id`
- **THEN** the Indonesian homepage is displayed

#### Scenario: Documentation with language

- **WHEN** user visits `/en/docs/getting-started`
- **THEN** the English documentation page for "getting-started" is displayed

### Requirement: Root Redirect

The root route `/` SHALL redirect to `/$lang` using the default language.

#### Scenario: Root to default language

- **WHEN** user visits `/`
- **THEN** user is redirected to `/id` (Indonesian, the default language)

### Requirement: Splat Routes for Documentation

Documentation routes SHALL use splat routes (`$.tsx`) to capture nested URL paths.

#### Scenario: Splat route captures path segments

- **WHEN** user visits `/id/docs/guides/installation`
- **THEN** the route handler receives `params._splat` as `'guides/installation'`
- **AND** the page for slugs `['guides', 'installation']` is loaded

#### Scenario: Splat route handles root documentation

- **WHEN** user visits `/id/docs`
- **THEN** the route handler receives `params._splat` as `undefined`
- **AND** the documentation index page is loaded

### Requirement: API Routes

Server-only API routes SHALL be defined in `src/routes/api/` without React components.

#### Scenario: Search API route

- **WHEN** a GET request is made to `/api/search`
- **THEN** the search handler processes the request
- **AND** returns a JSON response

### Requirement: Server-Side Data Loading

Route handlers SHALL use `createServerFn` for server-side data fetching with SSR support.

#### Scenario: Documentation page data loading

- **WHEN** a documentation page is requested
- **THEN** the server function fetches page content and page tree
- **AND** throws `notFound()` if page does not exist

### Requirement: Route Type Safety

The route tree SHALL be auto-generated in `src/routeTree.gen.ts` with full TypeScript types for paths and parameters.

#### Scenario: Generated route types

- **WHEN** routes are defined in `src/routes/`
- **THEN** `routeTree.gen.ts` exports typed route definitions
- **AND** `FileRoutesByFullPath` interface includes all route paths
