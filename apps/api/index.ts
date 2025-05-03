import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import 'dotenv/config'

import { protect } from './middlewares/auth.js'
import { verifyWebhook } from './middlewares/webhookAuth.js'
import releases from './routes/releases.js'
import deployments from './routes/deployments.js'
import events from './routes/events.js'

const app = new Hono().basePath('/api')

app.use('*', logger())
app.use('/events/*', verifyWebhook)

app.use('/releases/*', protect)
app.route('/releases', releases)
app.route('/deployments', deployments)
app.route('/events', events)

app.get('/', (c) => {
  return c.text('Hello!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
