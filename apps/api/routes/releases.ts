import { Hono } from 'hono'
import { db } from '../db/index.js';
import { releasesTable, eventsTable } from '../db/schema.js';
import { and, desc, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()

app.get('/', async (c) => {
  const status = c.req.query('status');

  // Build query based on status filter
  const releases = await (
    status === 'open'
      ? db.select().from(releasesTable).where(eq(releasesTable.status, 'open'))
      : status === 'closed'
        ? db.select().from(releasesTable).where(eq(releasesTable.status, 'closed'))
        : db.select().from(releasesTable)
  ).orderBy(desc(releasesTable.createdAt));

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

  if (isNaN(id)) {
      throw new HTTPException(400, { message: 'Invalid release ID' });
  }

  let query = db.query.releasesTable.findFirst({
      where: eq(releasesTable.id, id),
      with: {
          webhooks: {
              // Order by receivedAt in descending order (most recent first)
              orderBy: desc(eventsTable.receivedAt)
          }
      }
  });

  const release = await query;

  if (!release) {
      throw new HTTPException(404, { message: 'Release not found' });
  }

  // Post-process the webhooks to filter out duplicates
  if (release.webhooks && release.webhooks.length > 0) {
      const seen = new Set();
      release.webhooks = release.webhooks.filter(webhook => {
          // If documentId is null or undefined, keep it
          if (!webhook.documentId) return true;

          // If we haven't seen this documentId before, keep it
          if (!seen.has(webhook.documentId)) {
              seen.add(webhook.documentId);
              return true;
          }

          // Otherwise, filter it out
          return false;
      });
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

  // Trigger a GitHub Action deployment for the preview environment
  try {
    // Import the helper function from deployments.ts
    const { triggerGitHubAction } = await import('../routes/deployments.js');

    // Trigger a preview deployment
    await triggerGitHubAction('preview', id, 'Release Closure');
  } catch (error) {
    console.error('Error triggering deployment:', error);
  }

  return c.json(updatedRelease[0]);
});

export default app
