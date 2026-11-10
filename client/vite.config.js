import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import contentSecurityPolicy from '../server/src/middleware/contentSecurityPolicy.js'

const apiOrigin = 'http://localhost:4000'

const documentPolicy = {
  name: 'marketplace-csp',
  configureServer(server) {
    // Vite injects one inline React Fast Refresh module in development.
    const preamble = react.preambleCode.replace('__BASE__', server.config.base)
    const hash = createHash('sha256').update(preamble).digest('base64')
    server.middlewares.use(contentSecurityPolicy({
      scriptSrc: ["'self'", `'sha256-${hash}'`],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", apiOrigin, 'ws://localhost:5175'],
    }))
  },
  configurePreviewServer(server) {
    server.middlewares.use(contentSecurityPolicy({ connectSrc: ["'self'", apiOrigin] }))
  },
}

export default defineConfig({
  plugins: [react(), documentPolicy],
  server: {
    port: 5175,
    strictPort: true,
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
})
