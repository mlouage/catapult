import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import 'dotenv/config'

import { protect } from './middlewares/auth.js'
import { verifyWebhook } from './middlewares/webhookAuth.js'
import releases from './routes/releases.js'
import deployments from './routes/deployments.js'
import entries from './routes/entries.js'
import events from './routes/events.js'
import { serveStatic } from '@hono/node-server/serve-static';

// Determine if running in production
const isProduction = process.env.NODE_ENV === 'production'

// Root application
const app = new Hono()

// API sub-application
const api = new Hono()

// Attach API middlewares and routes
api.use('*', logger())
api.use('/events/*', verifyWebhook)
api.use('/releases/*', protect)
api.route('/releases', releases)
api.use('/entries/*', protect)
api.route('/entries', entries)
api.route('/deployments', deployments)
api.route('/events', events)

// Mount API under /api
app.route('/api', api)

// Serve frontend static files only in production
if (isProduction) {
  // Use 'root' to point to the public directory for static assets
  app.use('*', serveStatic({ root: './public' }))
}

// Start server
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
