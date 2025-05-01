import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list deployments'))
app.post('/', (c) => c.json('created a deployment', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
