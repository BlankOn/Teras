import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { createRequestListener } from '@remix-run/node-fetch-server'
import handler from './dist/server/server.js'

const port = Number(process.env.PORT) || 3000
const clientDir = path.resolve('dist/client')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
}

const ssrHandler = createRequestListener((req) => handler.fetch(req))

const server = http.createServer((req, res) => {
  const urlPath = new URL(req.url, 'http://localhost').pathname
  const filePath = path.join(clientDir, urlPath)

  // Prevent path traversal outside clientDir
  if (!filePath.startsWith(clientDir)) {
    res.writeHead(403)
    res.end()
    return
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      const ext = path.extname(filePath)
      const mime = MIME[ext] ?? 'application/octet-stream'
      const isImmutable = urlPath.startsWith('/assets/')
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': stat.size,
        'Cache-Control': isImmutable
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=3600',
      })
      fs.createReadStream(filePath).pipe(res)
    } else {
      ssrHandler(req, res)
    }
  })
})

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
