# layout-theming Specification

## Purpose
TBD - created by archiving change document-existing-codebase. Update Purpose after archive.
## Requirements
### Requirement: Root Layout Provider Hierarchy

The root layout SHALL wrap all routes with TanStack and Fumadocs providers in the correct order.

#### Scenario: Provider nesting order

- **WHEN** the root layout is rendered
- **THEN** `TanstackProvider` wraps `RootProvider`
- **AND** `RootProvider` receives the i18n provider for the current language

### Requirement: HomeLayout for Simple Pages

Pages without sidebar navigation SHALL use Fumadocs `HomeLayout` component.

#### Scenario: Homepage layout

- **WHEN** the homepage is rendered
- **THEN** it uses `HomeLayout` with base options

#### Scenario: Download page layout

- **WHEN** the download page is rendered
- **THEN** it uses `HomeLayout` with base options

### Requirement: DocsLayout for Documentation

Documentation pages with sidebar navigation SHALL use Fumadocs `DocsLayout` component.

#### Scenario: Docs page layout

- **WHEN** a documentation page is rendered
- **THEN** it uses `DocsLayout` with base options and page tree

#### Scenario: Dev wiki layout

- **WHEN** a developer wiki page is rendered
- **THEN** it uses `DocsLayout` with base options and page tree

### Requirement: Shared Base Options

All layouts SHALL receive consistent configuration via `baseOptions(locale)` function.

#### Scenario: Base options structure

- **WHEN** `baseOptions('id')` is called
- **THEN** the returned object includes `i18n` configuration
- **AND** `nav` with logo and home URL
- **AND** `links` array with localized navigation items

### Requirement: Logo Dark Mode Switching

The navigation logo SHALL display different images for light and dark modes.

#### Scenario: Light mode logo

- **WHEN** the site is in light mode
- **THEN** `/logo-black.png` is displayed
- **AND** `/logo-white.png` is hidden

#### Scenario: Dark mode logo

- **WHEN** the site is in dark mode
- **THEN** `/logo-white.png` is displayed
- **AND** `/logo-black.png` is hidden

### Requirement: CSS Variable System

The styling SHALL use CSS custom properties defined in `:root` and `.dark` selectors.

#### Scenario: Light mode colors

- **WHEN** light mode is active
- **THEN** `--background` is white (oklch(1 0 0))
- **AND** `--foreground` is near-black

#### Scenario: Dark mode colors

- **WHEN** dark mode is active (`.dark` class present)
- **THEN** `--background` is near-black
- **AND** `--foreground` is near-white

### Requirement: OKLCH Color Space

Color definitions SHALL use the OKLCH color space for perceptually uniform colors.

#### Scenario: Color variable format

- **WHEN** CSS variables are defined
- **THEN** colors use `oklch(lightness chroma hue)` format

### Requirement: Dark Mode Class-Based Switching

Dark mode SHALL be controlled by adding/removing the `.dark` class on a parent element.

#### Scenario: Theme class application

- **WHEN** dark mode is enabled
- **THEN** the `.dark` class is added to the document
- **AND** CSS `@custom-variant dark (&:is(.dark *))` applies dark styles

### Requirement: Tailwind Theme Integration

CSS custom properties SHALL be mapped to Tailwind utility classes via `@theme inline`.

#### Scenario: Color utilities

- **WHEN** Tailwind is configured
- **THEN** `bg-background` uses `var(--background)`
- **AND** `text-foreground` uses `var(--foreground)`

### Requirement: Hydration Warning Suppression

The `<html>` element SHALL have `suppressHydrationWarning` to prevent theme flash issues.

#### Scenario: Hydration safety

- **WHEN** the page is server-rendered and hydrated
- **THEN** no React hydration warnings occur due to theme state differences

### Requirement: Navigation Links

The navigation SHALL include links to all main site sections with proper active states.

#### Scenario: Navigation link structure

- **WHEN** navigation is rendered
- **THEN** links include Home, Download, Docs, and Dev
- **AND** each link uses the current locale prefix

#### Scenario: Active state detection

- **WHEN** user is on a documentation page
- **THEN** the Docs link has `active: 'nested-url'` highlighting

