import { Hono } from 'hono'
import { db } from '../db/index.js';
import { eventsTable } from '../db/schema.js';
import { eq, and, gte, desc } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()

app.get('/', async (c) => {
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Query events from the last 30 days, limited to 30 items
  const entries = await db.query.eventsTable.findMany({
    where: and(
      gte(eventsTable.receivedAt, thirtyDaysAgo)
    ),
    orderBy: [desc(eventsTable.receivedAt)],
    limit: 30
  });

  return c.json(entries);
});

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
