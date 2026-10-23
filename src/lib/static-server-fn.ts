import { createMiddleware } from '@tanstack/react-start'

// Server functions need a running server, which a static host does not have.
// While prerendering, this middleware stores each result as a JSON file in the
// client output. In the browser it reads that file first and only calls the
// real server function when the file is missing (e.g. the SSR deployment).

function hash(input: string) {
  // FNV-1a; crypto.subtle is unavailable on plain-http origins.
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

function cacheUrl(functionId: string, data: unknown) {
  return `/__static/${hash(`${functionId}__${JSON.stringify(data ?? null)}`)}.json`
}

export const staticServerFnMiddleware = createMiddleware({ type: 'function' })
  .client(async (ctx) => {
    if (
      process.env.NODE_ENV === 'production' &&
      typeof document !== 'undefined'
    ) {
      try {
        const res = await fetch(cacheUrl(ctx.functionId, ctx.data))
        if (res.headers.get('content-type')?.includes('application/json')) {
          // Same shape the client receives from a real server function call.
          return { result: await res.json(), context: ctx.context } as never
        }
      } catch {
        // Fall through to the server function.
      }
    }
    return ctx.next()
  })
  .server(async (ctx) => {
    const response = await ctx.next()
    if (process.env.TSS_PRERENDERING === 'true') {
      const fs = await import('node:fs/promises')
      const path = await import('node:path')
      const file = path.join(
        process.env.TSS_CLIENT_OUTPUT_DIR as string,
        cacheUrl(ctx.functionId, ctx.data),
      )
      await fs.mkdir(path.dirname(file), { recursive: true })
      await fs.writeFile(
        file,
        JSON.stringify((response as { result?: unknown }).result),
      )
    }
    return response
  })
