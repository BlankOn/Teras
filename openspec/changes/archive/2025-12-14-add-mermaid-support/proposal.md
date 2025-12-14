# Change: Add Mermaid Diagram Support

## Why

Documentation often benefits from visual diagrams to explain architecture, workflows, and relationships. Mermaid is a widely-used diagram-as-code tool that allows authors to create diagrams using simple text syntax directly in MDX files, making documentation more maintainable and version-controllable.

## What Changes

- Add `mermaid` npm dependency for client-side diagram rendering
- Create a `Mermaid` React component that renders diagrams with theme-aware styling (light/dark mode)
- Configure `remarkMdxMermaid` plugin from `fumadocs-core/mdx-plugins` to enable code block syntax
- Register the `Mermaid` component in MDX component mappings for both docs and dev routes
- Migrate existing static PNG diagrams in "Tentang BlankOn" page to Mermaid code blocks:
  - `produk-luar-negeri.png` - consumer mentality diagram (foreign products → Indonesian people)
  - `produk-sendiri.png` - producer mentality diagram (Indonesian people → domestic products)

## Impact

- Affected specs: `docs-content`
- Affected code:
  - `package.json` - new dependency
  - `source.config.ts` - remark plugin configuration
  - `src/components/mdx/mermaid.tsx` - new component (to be created)
  - `src/routes/$lang/docs/$.tsx` - MDX component registration
  - `src/routes/$lang/dev/$.tsx` - MDX component registration
- Affected content:
  - `content/dev/memulai/tentang-blankon/index.mdx` - replace PNG images with Mermaid code blocks
- Files to remove:
  - `public/dev/images/produk-luar-negeri.png`
  - `public/dev/images/produk-sendiri.png`
