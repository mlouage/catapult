import { Hono } from 'hono'
import { db } from '../db/index.js';
import { releasesTable } from '../db/schema.js';
import { and, desc, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()

app.get('/', async (c) => {
  const status = c.req.query('status');

  let query = db.select().from(releasesTable);

  if (status === 'open') {
      query = query.where(eq(releasesTable.status, 'open'));
  } else if (status === 'closed') {
      query = query.where(eq(releasesTable.status, 'closed'));
  }

  const releases = await query.orderBy(desc(releasesTable.createdAt));

  return c.json(releases);
});

app.post('/', async (c) => {
  const { title, description } = await c.req.json<{ title: string; description?: string }>();

  if (!title) {
      throw new HTTPException(400, { message: 'Title is required to create a release' });
  }

  const existingOpenRelease = await db.query.releasesTable.findFirst({
      where: eq(releasesTable.status, 'open'),
  });

  if (existingOpenRelease) {
      throw new HTTPException(400, { message: `Cannot create a new release. Release ID ${existingOpenRelease.id} is currently open.` });
  }

  const newRelease = await db.insert(releasesTable).values({
      title: title,
      description: description,
      status: 'open',
  }).returning();

  if (!newRelease || newRelease.length === 0) {
       throw new Error('Failed to create release.');
  }

  return c.json(newRelease[0], 201);
});

app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const includeWebhooks = c.req.query('events') === 'true';

  if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid release ID' });
  }

  let query = db.query.releasesTable.findFirst({
      where: eq(releasesTable.id, id),
      with: includeWebhooks ? { webhooks: true } : undefined,
  });

  const release = await query;

  if (!release) {
      throw new HTTPException(404, { message: 'Release not found' });
  }

  return c.json(release);
});

app.post('/:id/close', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid release ID' });
  }

  const releaseToClose = await db.query.releasesTable.findFirst({
      where: and(eq(releasesTable.id, id), eq(releasesTable.status, 'open')),
  });

  if (!releaseToClose) {
      const anyRelease = await db.query.releasesTable.findFirst({ where: eq(releasesTable.id, id) });
      if (!anyRelease) {
           throw new HTTPException(404, { message: 'Release not found' });
      } else {
           throw new HTTPException(400, { message: `Release ID ${id} is not currently open.` });
      }
  }

  const updatedRelease = await db.update(releasesTable)
      .set({
          status: 'closed',
          closedAt: new Date(),
      })
      .where(eq(releasesTable.id, id))
      .returning();

   if (!updatedRelease || updatedRelease.length === 0) {
       throw new Error('Failed to update release status.');
  }


  return c.json(updatedRelease[0]);
});

export default app
