# Change: Document Existing Codebase as Specifications

## Why

The Teras project has no existing specifications documenting its capabilities. This change establishes baseline specs that document current behavior, enabling spec-driven development for future changes and ensuring consistent understanding of system requirements.

## What Changes

- **NEW** `specs/routing/spec.md` - File-based routing with TanStack Router/Start and i18n URL structure
- **NEW** `specs/i18n/spec.md` - Internationalization system with Indonesian default and English support
- **NEW** `specs/docs-content/spec.md` - Fumadocs MDX content collections for docs and dev wiki
- **NEW** `specs/search-api/spec.md` - Full-text search API with language-aware indexing
- **NEW** `specs/layout-theming/spec.md` - Layout hierarchy, dark mode, and CSS variable system
- **NEW** `specs/site-pages/spec.md` - Homepage and download page structure

## Impact

- Affected specs: None (all new)
- Affected code: None (documentation only, no implementation changes)
- This establishes the foundation for spec-driven development going forward
