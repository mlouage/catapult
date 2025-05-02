import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import 'dotenv/config'

import { protect } from './middlewares/auth.js'
import releases from './releases.js'
import deployments from './deployments.js'

const app = new Hono().basePath('/api');

app.use('*', logger());

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/releases', releases)
app.route('/deployments', deployments)

const protectedRoutes = app.use('/protected/*', protect)

app.get('/protected/protected-data', (c) => {
  // Access user info from context if set in middleware
  const user = c.get('user');
  console.log('Accessing protected data for user:', user?.oid);

  return c.json({
    message: 'This is protected data!',
    userId: user?.oid, // Example using data from token
    userName: user?.name,
    scopes: user?.scp,
  });
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
