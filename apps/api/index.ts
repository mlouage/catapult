import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import releases from './releases.js'
import deployments from './deployments.js'

const app = new Hono().basePath('/api');

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/releases', releases)
app.route('/deployments', deployments)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
