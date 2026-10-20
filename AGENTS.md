<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS.md

## Build/Test Commands

- `npm run dev` - Start dev server on port 3000
- `npm run build` - Build for production
- `npm run test` - Run all tests (vitest)
- `npx vitest run path/to/file.test.ts` - Run a single test file
- `npm run lint` - Run ESLint
- `npm run check` - Format with Prettier and fix ESLint issues

## Code Style

- **No semicolons**, single quotes, trailing commas (Prettier config)
- **Strict TypeScript** - no unused locals/parameters, strict mode enabled
- **Path aliases**: Use `@/*` for `./src/*` imports
- **Imports**: External packages first, then internal with `@/` alias
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Components**: Default exports for route components, named exports for utilities

## Git Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, no logic change)
- `refactor` - Code refactoring (no feature/fix)
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependencies, configs

### Examples

```
feat: add download page with ISO links
fix: resolve search API language detection
docs: update installation guide for BlankOn 16
chore: update fumadocs dependencies
refactor: extract shared layout options
```

Run `npm run check` before committing.

## Stack

- React 19 + TanStack Start/Router + Tailwind CSS v4
- Cloudflare Workers deployment (Wrangler)
- ESLint uses `@tanstack/eslint-config`

## Shadcn Components

Use: `npx shadcn@latest add <component>` (e.g., `add button`)

## News: Package Update Articles

When asked to create, write, or update a package update article in `content/news/`, follow the structure of the latest existing one (e.g. `content/news/2026-10-20-package-updates-2026-10-20.en.md`). Reuse its **structure and wording conventions only**.

**Never copy content values from a previous article.** The package list, versions, package count, "what's new" items, known issues, images, and kudos/credits must come from the human for this round. If any of these are missing, ask instead of guessing or reusing old values.

### Files and title

- Always write both languages: `YYYY-MM-DD-package-updates-YYYY-MM-DD.en.md` and `.id.md`. The date appears twice because each slug must be unique.
- Title: `# Package Updates YYYY-MM-DD` (en) and `# Pembaruan Paket YYYY-MM-DD` (id), followed by a `---` line.

### Content pattern (in order)

1. Intro paragraph: a new round of updates is available for the current release, and how many packages it updates (count = rows in the table).
2. Optional known-issue blockquote (`> **Known issue with ...:**`) with workaround steps, only if the human reports one.
3. Update instructions: the `sudo apt update && sudo apt full-upgrade` code block, then "Or update via GNOME Software."
4. `## What's in this update` / `## Isi pembaruan ini`: one sentence introducing the table (mention security updates only if the human says so), then the table.
5. Optional `## What's new in <Project>` sections for notable changes the human provides, as a bullet list with bold lead-ins, PR links, and images from `content/assets/` placed under the item they illustrate (with descriptive alt text).
6. `## Kudos` (both languages): bold names with what they did, as provided by the human; a final non-bold line thanking the rest of the BlankOn Linux development team.
7. `## We want your feedback` / `## Kami menunggu masukan Anda` and `## How to Support Us` / `## Cara Mendukung Kami` boilerplate, ending with "Salam merdeka!".

### Table pattern

- Two columns: `| Package | Version |` (en) and `| Paket | Versi |` (id).
- One row per **binary** package, sorted alphabetically, with the **new** version (e.g. the arsip-dev version from the human's list).
- Exclude packages the human marks as not being updated (e.g. "Not in arsip-dev").
- Run `npx prettier --write content/news/<file>` so columns are aligned.
