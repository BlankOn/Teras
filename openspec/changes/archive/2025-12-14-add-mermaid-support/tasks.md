## 1. Dependencies

- [x] 1.1 Install `mermaid` npm package

## 2. Component Implementation

- [x] 2.1 Create `src/components/mdx/mermaid.tsx` client component
  - Use `useTheme` from `next-themes` for theme detection
  - Implement lazy loading of mermaid library
  - Handle SSR hydration safely with mounted state
  - Support theme switching (light/dark)

## 3. MDX Configuration

- [x] 3.1 Add `remarkMdxMermaid` plugin to `source.config.ts`
- [x] 3.2 Register `Mermaid` component in `src/routes/$lang/docs/$.tsx`
- [x] 3.3 Register `Mermaid` component in `src/routes/$lang/dev/$.tsx`

## 4. Content Migration

- [x] 4.1 Replace `produk-luar-negeri.png` image in `content/dev/memulai/tentang-blankon/index.mdx` with Mermaid code block
- [x] 4.2 Replace `produk-sendiri.png` image in `content/dev/memulai/tentang-blankon/index.mdx` with Mermaid code block
- [x] 4.3 Remove unused PNG files from `public/dev/images/`

## 5. Validation

- [x] 5.1 Verify diagrams render correctly in light mode
- [x] 5.2 Verify diagrams render correctly in dark mode
- [x] 5.3 Verify code block syntax (```mermaid) works
- [x] 5.4 Run build to ensure no SSR issues
