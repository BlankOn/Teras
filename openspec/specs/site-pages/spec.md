# site-pages Specification

## Purpose

TBD - created by archiving change document-existing-codebase. Update Purpose after archive.

## Requirements

### Requirement: Homepage Structure

The homepage SHALL display a centered layout with the BlankOn title and localized welcome message.

#### Scenario: Homepage content

- **WHEN** user visits `/$lang/`
- **THEN** "BlankOn" heading is displayed
- **AND** a localized welcome message is shown

#### Scenario: Indonesian welcome message

- **WHEN** user visits `/id`
- **THEN** the welcome message is "Selamat datang di BlankOn"

#### Scenario: English welcome message

- **WHEN** user visits `/en`
- **THEN** the welcome message is "Welcome to BlankOn"

### Requirement: Download Page Structure

The download page SHALL display a centered layout with localized title and description.

#### Scenario: Download page content

- **WHEN** user visits `/$lang/download`
- **THEN** a localized download title is displayed
- **AND** a localized description is shown

#### Scenario: Indonesian download page

- **WHEN** user visits `/id/download`
- **THEN** the title is "Unduh"
- **AND** the description is "Halaman unduh BlankOn"

#### Scenario: English download page

- **WHEN** user visits `/en/download`
- **THEN** the title is "Download"
- **AND** the description is "BlankOn download page"

### Requirement: Navigation Consistency

Both homepage and download page SHALL use the same navigation structure via `baseOptions`.

#### Scenario: Consistent navigation

- **WHEN** any simple page is rendered
- **THEN** the navigation includes Home, Download, Docs, and Dev links
- **AND** all links are prefixed with the current locale

### Requirement: Language Parameter Access

Page components SHALL access the language from route parameters using `Route.useParams()`.

#### Scenario: Language parameter usage

- **WHEN** a page component renders
- **THEN** it extracts `lang` from `Route.useParams()`
- **AND** uses it to get translations and configure layout

### Requirement: Fumadocs HomeLayout Integration

Simple pages SHALL use Fumadocs `HomeLayout` for consistent header and navigation.

#### Scenario: HomeLayout wrapper

- **WHEN** homepage or download page renders
- **THEN** content is wrapped in `HomeLayout` component
- **AND** base options are passed with current locale

### Requirement: Responsive Centering

Page content SHALL be centered using flexbox with full height utilization.

#### Scenario: Content centering

- **WHEN** homepage or download page renders
- **THEN** main content uses `flex flex-1 flex-col items-center justify-center`
- **AND** content is vertically and horizontally centered

### Requirement: Static Assets

The public directory SHALL contain logo variants and PWA assets.

#### Scenario: Logo assets

- **WHEN** logos are needed
- **THEN** `/logo-black.png` is available for light mode
- **AND** `/logo-white.png` is available for dark mode
- **AND** `/logo-icon.svg` is available for icon-only usage

#### Scenario: PWA assets

- **WHEN** PWA is installed
- **THEN** `/logo192.png` and `/logo512.png` are available
- **AND** `/manifest.json` defines the web app manifest
