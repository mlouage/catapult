import { Hono } from 'hono'
import { db } from '../db/index.js';
import { eventsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()

app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid entry ID' });
  }

  let query = db.query.eventsTable.findFirst({
      where: eq(eventsTable.id, id)
  });

  const entry = await query;

  if (!entry) {
      throw new HTTPException(404, { message: 'Entry not found' });
  }

  return c.json(entry);
});

export default app
