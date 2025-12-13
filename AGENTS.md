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
