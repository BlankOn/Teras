# i18n Specification

## Purpose
TBD - created by archiving change document-existing-codebase. Update Purpose after archive.
## Requirements
### Requirement: Language Configuration

The system SHALL define supported languages using Fumadocs `defineI18n` with Indonesian as the default language.

#### Scenario: Default language configuration

- **WHEN** the i18n configuration is loaded
- **THEN** `defaultLanguage` is `'id'` (Indonesian)
- **AND** `languages` array is `['id', 'en']`

### Requirement: URL-Based Language Selection

The current language SHALL be determined by the `$lang` URL parameter.

#### Scenario: Language from URL

- **WHEN** user visits `/en/docs`
- **THEN** the `lang` parameter is `'en'`
- **AND** English content is displayed

#### Scenario: Default language URL

- **WHEN** user visits `/id/download`
- **THEN** the `lang` parameter is `'id'`
- **AND** Indonesian content is displayed

### Requirement: UI Translations

Framework UI elements SHALL be translated using `defineI18nUI` with locale-specific strings.

#### Scenario: Indonesian UI translations

- **WHEN** the language is `'id'`
- **THEN** search placeholder shows "Cari dokumentasi"
- **AND** table of contents label shows "Daftar Isi"
- **AND** last update label shows "Terakhir diperbarui"

#### Scenario: English UI translations

- **WHEN** the language is `'en'`
- **THEN** Fumadocs default English translations are used
- **AND** display name shows "English"

### Requirement: App-Level Translations

Application-specific text SHALL be translated using a `getTranslations(locale)` function.

#### Scenario: Navigation translations

- **WHEN** `getTranslations('id')` is called
- **THEN** `home` returns "Beranda"
- **AND** `download` returns "Unduh"
- **AND** `docs` returns "Panduan Pengguna"
- **AND** `dev` returns "Wiki Pengembangan"

#### Scenario: Page content translations

- **WHEN** `getTranslations('en')` is called
- **THEN** `welcome` returns "Welcome to BlankOn"
- **AND** `downloadDesc` returns "BlankOn download page"

### Requirement: Content File i18n Naming

MDX content files SHALL follow the naming convention `{name}.mdx` for default language and `{name}.{lang}.mdx` for other languages.

#### Scenario: Default language content

- **WHEN** an MDX file is named `content/docs/index.mdx`
- **THEN** it is the Indonesian (default) version of the page

#### Scenario: English content variant

- **WHEN** an MDX file is named `content/docs/index.en.mdx`
- **THEN** it is the English version of the same page

### Requirement: HTML Language Attribute

The `<html>` element SHALL have a `lang` attribute set to the current language code.

#### Scenario: HTML lang attribute

- **WHEN** user visits `/en/docs`
- **THEN** the HTML element has `lang="en"`

### Requirement: Language Switcher

The layout SHALL provide a language switcher allowing users to change between supported languages.

#### Scenario: Language switcher visibility

- **WHEN** a page is displayed
- **THEN** a language switcher is available in the navigation
- **AND** it shows all supported languages with their display names

