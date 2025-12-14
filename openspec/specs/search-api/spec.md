# search-api Specification

## Purpose

TBD - created by archiving change document-existing-codebase. Update Purpose after archive.

## Requirements

### Requirement: Search API Endpoint

The system SHALL provide a search API at `/api/search` that handles GET requests.

#### Scenario: Search endpoint availability

- **WHEN** a GET request is made to `/api/search?query=documentation`
- **THEN** a JSON response with search results is returned

### Requirement: i18n-Aware Search

The search API SHALL use `createI18nSearchAPI` with language-specific text analysis.

#### Scenario: Indonesian search stemming

- **WHEN** search is performed with `locale=id`
- **THEN** Indonesian language analyzer is used for stemming
- **AND** stop words are filtered appropriately

#### Scenario: English search stemming

- **WHEN** search is performed with `locale=en`
- **THEN** English language analyzer is used for stemming

### Requirement: Multi-Source Indexing

The search index SHALL include pages from both `docs` and `dev` content collections.

#### Scenario: Combined index

- **WHEN** the search index is built
- **THEN** all pages from `source.getPages(lang)` are included
- **AND** all pages from `devSource.getPages(lang)` are included

### Requirement: Locale Map Configuration

The search API SHALL map language codes to full-text search language analyzers.

#### Scenario: Locale to analyzer mapping

- **WHEN** the search API is configured
- **THEN** `id` maps to `'indonesian'` analyzer
- **AND** `en` maps to `'english'` analyzer

### Requirement: Search Document Schema

Each indexed document SHALL include locale, id, title, description, url, and structured data.

#### Scenario: Document indexing

- **WHEN** a page is indexed for search
- **THEN** the index entry includes `locale` matching the page language
- **AND** `id` set to the page URL
- **AND** `title` from page frontmatter
- **AND** `description` from page frontmatter
- **AND** `url` for result linking
- **AND** `structuredData` for heading-level search

### Requirement: Advanced Search Mode

The search API SHALL use `'advanced'` mode for structured data support and section-level matching.

#### Scenario: Section-level search

- **WHEN** search is performed with structured data enabled
- **THEN** results can match specific headings within documents
- **AND** result URLs can include anchor links to matched sections

### Requirement: Language-Filtered Results

Search results SHALL be filtered to only return documents matching the requested locale.

#### Scenario: Language filtering

- **WHEN** search is performed with `locale=en`
- **THEN** only English content is returned in results
- **AND** Indonesian content is excluded
