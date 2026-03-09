import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:checksum'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const CHECKSUM_URL =
  'http://jahitan.blankonlinux.id/harian/current/blankon-live-image-amd64.hybrid.iso.sha256sum'

export function checksumPlugin(): Plugin {
  let checksum = ''

  return {
    name: 'checksum',
    async buildStart() {
      try {
        const res = await fetch(CHECKSUM_URL)
        const text = await res.text()
        checksum = text.trim().split(/\s+/)[0]
      } catch (e) {
        this.warn(`Failed to fetch checksum: ${e}`)
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id === RESOLVED_ID) {
        return `export const checksum = ${JSON.stringify(checksum)}`
      }
    },
  }
}
