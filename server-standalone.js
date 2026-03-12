#!/usr/bin/env node

/**
 * Standalone Node.js server for TanStack Start application
 * This wraps the fetch handler in a simple HTTP server
 */

import { createServer } from 'node:http'
import server from './dist/server/server.js'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

// Create HTTP server
const httpServer = createServer(async (req, res) => {
  try {
    // Build the full URL
    const protocol = req.connection.encrypted ? 'https' : 'http'
    const url = new URL(req.url, `${protocol}://${req.headers.host}`)

    // Convert Node.js request headers to Web Headers
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v))
        } else {
          headers.append(key, value)
        }
      }
    }

    // Get request body for non-GET/HEAD requests
    const body = req.method !== 'GET' && req.method !== 'HEAD'
      ? await new Promise((resolve, reject) => {
          const chunks = []
          req.on('data', (chunk) => chunks.push(chunk))
          req.on('end', () => resolve(Buffer.concat(chunks)))
          req.on('error', reject)
        })
      : undefined

    // Create Web Request
    const request = new Request(url, {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    })

    // Call the TanStack Start fetch handler
    const response = await server.fetch(request)

    // Convert Web Response to Node.js response
    res.statusCode = response.status

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    // Stream the response body
    if (response.body) {
      const reader = response.body.getReader()
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            res.end()
            break
          }
          if (!res.write(value)) {
            await new Promise(resolve => res.once('drain', resolve))
          }
        }
      }
      await pump()
    } else {
      res.end()
    }
  } catch (error) {
    console.error('Server error:', error)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain')
    }
    if (!res.writableEnded) {
      res.end('Internal Server Error')
    }
  }
})

httpServer.listen(PORT, HOST, () => {
  console.log(`✓ Server running at http://${HOST}:${PORT}`)
})

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, closing server...`)
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
