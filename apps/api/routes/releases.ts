import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list releases'))
app.post('/', (c) => c.json('created a release', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
