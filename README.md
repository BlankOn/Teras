# Teras

Official Homepage, Documentation, and Developer Wiki for [BlankOn Linux](https://blankon.id) — an Indonesian Linux distribution based on Debian.

> **Teras** (Indonesian for "porch/terrace") serves as the central hub for showcasing BlankOn, providing user documentation, and hosting developer guides.

## Tech Stack

- **React 19** + **TanStack Start/Router** — Full-stack React with SSR
- **Fumadocs** — Documentation framework with MDX support
- **Tailwind CSS v4** — Styling with shadcn/ui components
- **Cloudflare Workers** — Edge deployment

## Getting Started

```bash
npm install
npm run dev      # Start dev server on port 3000
```

## Scripts

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start development server                       |
| `npm run sync-wiki`| Clone revival repo and sync wiki content       |
| `npm run build`    | Build for production (auto-syncs wiki first)   |
| `npm run test`     | Run tests (Vitest)                             |
| `npm run lint`     | Run ESLint                                     |
| `npm run check`    | Format with Prettier and fix linting           |
| `npm run deploy`   | Deploy to Cloudflare Workers                   |

## Project Structure

```
teras/
├── content/           # MDX documentation content
│   └── wiki/          # Wiki content (auto-generated from revival repo)
├── public/            # Static assets
│   └── wiki/assets/   # Wiki assets (auto-copied from revival repo)
├── scripts/           # Build and utility scripts
│   └── sync-wiki.mjs  # Script to sync wiki from revival repo
├── src/
│   ├── lib/           # Utilities, i18n, content sources
│   └── routes/        # TanStack Router file-based routes
├── openspec/          # Specifications and change proposals
└── AGENTS.md          # AI assistant instructions
```

## Wiki Content

The wiki content is **automatically generated** from the [BlankOn revival repository](https://github.com/blankon/revival).

- Content is cloned from `https://github.com/blankon/revival`
- Markdown files (`.md`) are converted to MDX (`.mdx`) with frontmatter
- Assets are copied to `public/wiki/assets/`
- The `sync-wiki` script runs automatically before each build (`prebuild` hook)

To manually sync wiki content:
```bash
npm run sync-wiki
```

## Internationalization

- **Default**: English (`en`)
- **Supported**: English, Indonesian (`id`)
- **URL structure**: `/{lang}/path` (e.g., `/en/wiki`, `/id/wiki`)

Content files use suffix convention:

- `index.mdx` — English (default)
- `index.id.mdx` — Indonesian

## Contributing

### Code Style

This project enforces consistent code style via Prettier and ESLint:

- **No semicolons** — Omit semicolons at end of statements
- **Single quotes** — Use `'single quotes'` for strings
- **Trailing commas** — Always include trailing commas in multiline structures
- **Strict TypeScript** — No unused locals/parameters, strict mode enabled
- **Path aliases** — Use `@/*` for `./src/*` imports

**Naming conventions:**

| Type                | Convention | Example                     |
| ------------------- | ---------- | --------------------------- |
| Components          | PascalCase | `DownloadPage`, `SearchBar` |
| Functions/variables | camelCase  | `getUserData`, `isLoading`  |
| Route parameters    | $prefix    | `$lang`, `$.tsx` (splat)    |

**Import order:**

1. External packages (`react`, `@tanstack/*`, `fumadocs-*`)
2. Internal imports using `@/` alias

Run `npm run check` before committing.

### Git Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>
```

| Type       | Purpose                                  |
| ---------- | ---------------------------------------- |
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation changes                    |
| `style`    | Code style (formatting, no logic change) |
| `refactor` | Code refactoring (no feature/fix)        |
| `test`     | Adding or updating tests                 |
| `chore`    | Maintenance tasks, dependencies, configs |

**Examples:**

```
feat: add download page with ISO links
fix: resolve search API language detection
docs: update installation guide for BlankOn 16
chore: update fumadocs dependencies
```

### Standard Workflow

1. Fork and clone the repository
2. Create a feature branch
3. Make changes and run `npm run check`
4. Submit a pull request

### Contributing with AI Assistants (LLM)

This project uses **OpenSpec** for spec-driven development. AI assistants (Claude, Copilot, Cursor, etc.) must follow these guidelines:

#### Required Reading

| File                                           | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| [`AGENTS.md`](./AGENTS.md)                     | Build commands, code style, git conventions |
| [`openspec/AGENTS.md`](./openspec/AGENTS.md)   | Spec-driven development workflow            |
| [`openspec/project.md`](./openspec/project.md) | Project context and conventions             |

#### When to Create a Proposal

Create an OpenSpec proposal (`openspec/changes/[change-id]/`) for:

- New features or capabilities
- Breaking changes (API, schema, architecture)
- Performance or security changes that affect behavior

#### When to Skip Proposals

Proceed directly for:

- Bug fixes restoring intended behavior
- Typos, formatting, comments
- Non-breaking dependency updates
- Configuration changes
- Tests for existing behavior

#### OpenSpec Workflow

1. **Create** — Scaffold proposal with `proposal.md`, `tasks.md`, and spec deltas
2. **Implement** — Follow `tasks.md` checklist after approval
3. **Archive** — Move to `changes/archive/` after deployment

```bash
# Validate a change proposal
openspec validate [change-id] --strict

# List active changes
openspec list

# List specifications
openspec list --specs
```

See [`openspec/AGENTS.md`](./openspec/AGENTS.md) for complete instructions.

## License

MIT License — see [LICENSE](./LICENSE) for details.
