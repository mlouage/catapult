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

const app = new Hono().basePath('/api')

app.use('*', logger())
app.use('/events/*', verifyWebhook)

app.use('/releases/*', protect)
app.route('/releases', releases)
app.use('/entries/*', protect)
app.route('/entries', entries)
app.route('/deployments', deployments)
app.route('/events', events)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
