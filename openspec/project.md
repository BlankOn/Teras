# Project Context

## Purpose

**Teras** (Indonesian for "porch/terrace") is the official Homepage, Documentation, and Developer Wiki for the BlankOn Linux project. It serves as the central hub for:

- Showcasing BlankOn Linux to new users and the community
- Providing comprehensive user documentation (Panduan Pengguna)
- Hosting developer wiki and contribution guides (Wiki Pengembangan)
- Distributing downloads and release information

BlankOn Linux is an Indonesian Linux distribution based on Debian, developed by the BlankOn community with a focus on Indonesian localization.

## Tech Stack

### Core Framework

- **React 19** - UI library
- **TanStack Start** - Full-stack React framework with SSR support
- **TanStack Router** - Type-safe file-based routing
- **TypeScript 5.7** - Strict mode enabled

### Documentation System

- **Fumadocs** - Documentation framework
  - `fumadocs-core` - Core functionality, i18n, search API
  - `fumadocs-mdx` - MDX content collections
  - `fumadocs-ui` - Pre-built UI layouts (DocsLayout, HomeLayout)
- **MDX** - Markdown with JSX support for content

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Fumadocs UI themes** - `neutral.css` and `preset.css`
- **tw-animate-css** - Animation utilities
- **class-variance-authority (CVA)** - Component variant management
- **clsx + tailwind-merge** - Conditional class utilities
- **OKLCH color space** - Modern color definitions with dark mode support

### UI Components

- **shadcn/ui** - Component library (install via `npx shadcn@latest add <component>`)
- **Lucide React** - Icon library

### Build & Deployment

- **Vite 7** - Build tool and dev server
- **Cloudflare Workers** - Edge deployment via Wrangler
- **@cloudflare/vite-plugin** - Cloudflare SSR integration

### Testing

- **Vitest** - Test runner
- **@testing-library/react** - React component testing
- **jsdom** - DOM environment for tests

### Code Quality

- **ESLint** - Linting with `@tanstack/eslint-config`
- **Prettier** - Code formatting

## Project Structure

```
teras/
├── content/                    # MDX content files
│   ├── docs/                   # User documentation
│   │   ├── index.mdx          # Indonesian (default)
│   │   └── index.en.mdx       # English translation
│   └── dev/                    # Developer wiki
│       ├── index.mdx          # Indonesian (default)
│       └── index.en.mdx       # English translation
├── public/                     # Static assets
│   ├── logo-black.png         # Light mode logo
│   ├── logo-white.png         # Dark mode logo
│   └── logo-icon.svg          # Icon variant
├── src/
│   ├── lib/
│   │   ├── i18n.ts            # i18n configuration (id, en)
│   │   ├── layout.shared.tsx  # Shared layout config & translations
│   │   ├── source.ts          # Fumadocs content sources
│   │   └── utils.ts           # Utility functions (cn)
│   ├── routes/
│   │   ├── __root.tsx         # Root layout with RootProvider
│   │   ├── index.tsx          # Redirect to /$lang
│   │   ├── $lang/
│   │   │   ├── index.tsx      # Homepage
│   │   │   ├── download.tsx   # Download page
│   │   │   ├── docs/$.tsx     # User docs (splat route)
│   │   │   └── dev/$.tsx      # Dev wiki (splat route)
│   │   └── api/
│   │       └── search.ts      # i18n search API endpoint
│   └── styles.css             # Global styles & CSS variables
├── source.config.ts           # Fumadocs MDX collections config
└── wrangler.jsonc             # Cloudflare Workers config
```

## Project Conventions

### Code Style

- **No semicolons** - Omit semicolons at end of statements
- **Single quotes** - Use single quotes for strings
- **Trailing commas** - Always include trailing commas
- **Strict TypeScript** - No unused locals/parameters, strict mode enabled

### Naming Conventions

- **PascalCase** - React components, types, interfaces
- **camelCase** - Functions, variables, file names (except components)
- **$param** - Dynamic route parameters (e.g., `$lang`, `$.tsx` for splat)

### Import Order

1. External packages (react, tanstack, fumadocs, etc.)
2. Internal imports using `@/` path alias

### Component Exports

- **Default exports** - Route components (required by TanStack Router)
- **Named exports** - Utility functions, shared components, server functions

### Path Aliases

- Use `@/*` for `./src/*` imports (e.g., `import { cn } from '@/lib/utils'`)

### Architecture Patterns

- **File-based routing** - Routes in `src/routes/` with TanStack Router conventions
- **i18n URL structure** - `/$lang/` prefix for all localized pages
- **Content collections** - MDX files in `content/` with Fumadocs
- **Server functions** - `createServerFn` for SSR data loading
- **Client loaders** - Fumadocs `createClientLoader` for MDX hydration

### Content Conventions

- **File naming for i18n**:
  - `index.mdx` - Default language (Indonesian)
  - `index.en.mdx` - English translation
- **Frontmatter required**: `title` and `description` fields

### Testing Strategy

- Run all tests: `npm run test`
- Run single test: `npx vitest run path/to/file.test.ts`
- Use Testing Library for component tests
- Test files should be co-located or in `__tests__` directories

### Git Workflow

- Keep commits atomic and descriptive
- Use conventional commit format: `type: description`
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `chore:` - Maintenance tasks
- Run `npm run check` before committing

## Domain Context

### BlankOn Linux

BlankOn is an Indonesian Linux distribution that:

- Is based on Debian
- Targets Indonesian users with localized content
- Is developed by a volunteer community
- Has release versions named after Indonesian cultural references

### Site Sections

| Route             | Indonesian        | English        | Purpose                |
| ----------------- | ----------------- | -------------- | ---------------------- |
| `/$lang/`         | Beranda           | Home           | Homepage/landing       |
| `/$lang/download` | Unduh             | Download       | ISO downloads          |
| `/$lang/docs`     | Panduan Pengguna  | User Guide     | End-user documentation |
| `/$lang/dev`      | Wiki Pengembangan | Developer Wiki | Contributor guides     |

### Internationalization

- **Default language**: Indonesian (`id`)
- **Supported languages**: Indonesian (`id`), English (`en`)
- **Implementation**: Fumadocs i18n with `defineI18n`
- **URL structure**: `/{lang}/path` (e.g., `/id/docs`, `/en/docs`)
- **Root redirect**: `/` redirects to `/id` (default language)

### UI Translations

Located in `src/routes/__root.tsx` and `src/lib/layout.shared.tsx`:

| Key        | Indonesian          | English           |
| ---------- | ------------------- | ----------------- |
| search     | Cari dokumentasi    | Search            |
| toc        | Daftar Isi          | Table of Contents |
| lastUpdate | Terakhir diperbarui | Last updated      |

## Important Constraints

- **Edge-first deployment** - Optimize for Cloudflare Workers edge runtime
- **SSR required** - Pages use server functions for data loading
- **i18n-first** - All routes must support language parameter
- **Performance** - Fast initial load, good Core Web Vitals
- **Accessibility** - Follow WCAG guidelines for inclusive design
- **Mobile-responsive** - Support mobile devices as primary use case

## External Dependencies

### Deployment

- **Cloudflare Workers** - Edge hosting platform (configured in `wrangler.jsonc`)

### Search

- **Fumadocs Search API** - Built-in full-text search at `/api/search`
- **Language-aware indexing** - Indonesian and English stemming support

### Potential Integrations

- **BlankOn Package Repository** - For displaying package information
- **BlankOn ISO Downloads** - Mirror/CDN links for distribution
- **GitHub** - Source code and issue tracking

## Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests with Vitest
npm run lint     # Run ESLint
npm run check    # Format (Prettier) + lint fix
npm run deploy   # Deploy to Cloudflare Workers
```
