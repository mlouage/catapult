import { Hono } from 'hono'
import { db } from '../db/index.js';
import { deploymentsTable } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const app = new Hono()

// Helper function to trigger a GitHub Action (mock implementation)
export async function triggerGitHubAction(environment: 'preview' | 'production', releaseId: number | null, triggeredBy: string) {
  // In a real implementation, this would call the GitHub API to trigger a workflow
  // For now, we'll just create a record in our database

  const newDeployment = await db.insert(deploymentsTable).values({
    name: `${environment.charAt(0).toUpperCase() + environment.slice(1)} deployment${releaseId ? ` for Release ${releaseId}` : ''}`,
    status: 'in_progress',
    environment,
    githubActionUrl: `https://github.com/owner/repo/actions/runs/${Date.now()}`, // This would be a real GitHub Action URL
    triggeredBy,
    releaseId,
    deployedAt: new Date(),
  }).returning();

  if (!newDeployment || newDeployment.length === 0) {
    throw new Error(`Failed to create ${environment} deployment.`);
  }

  return newDeployment[0];
}

// Get all deployments
app.get('/', async (c) => {
  const environment = c.req.query('environment');

  let query = db.select().from(deploymentsTable);

  if (environment === 'preview' || environment === 'production') {
    query = query.where(eq(deploymentsTable.environment, environment));
  }

  const deployments = await query.orderBy(desc(deploymentsTable.deployedAt));

  return c.json(deployments);
})

// Create a new deployment
app.post('/', async (c) => {
  const { name, status, environment, githubActionUrl, triggeredBy, releaseId } = 
    await c.req.json<{ 
      name: string; 
      status: 'completed' | 'failed' | 'in_progress'; 
      environment: 'preview' | 'production';
      githubActionUrl: string;
      triggeredBy: string;
      releaseId?: number;
    }>();

  if (!name || !status || !environment || !githubActionUrl || !triggeredBy) {
    throw new HTTPException(400, { message: 'Missing required fields' });
  }

  const newDeployment = await db.insert(deploymentsTable).values({
    name,
    status: status as any,
    environment: environment as any,
    githubActionUrl,
    triggeredBy,
    releaseId: releaseId || null,
    deployedAt: new Date(),
  }).returning();

  if (!newDeployment || newDeployment.length === 0) {
    throw new Error('Failed to create deployment.');
  }

  return c.json(newDeployment[0], 201);
})

// Get a specific deployment
app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid deployment ID' });
  }

  const deployment = await db.query.deploymentsTable.findFirst({
    where: eq(deploymentsTable.id, id),
  });

  if (!deployment) {
    throw new HTTPException(404, { message: 'Deployment not found' });
  }

  return c.json(deployment);
})

// Update deployment status
app.patch('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid deployment ID' });
  }

  const { status } = await c.req.json<{ status: 'completed' | 'failed' | 'in_progress' }>();

  if (!status) {
    throw new HTTPException(400, { message: 'Status is required' });
  }

  const updatedDeployment = await db.update(deploymentsTable)
    .set({ status: status as any })
    .where(eq(deploymentsTable.id, id))
    .returning();

  if (!updatedDeployment || updatedDeployment.length === 0) {
    throw new HTTPException(404, { message: 'Deployment not found' });
  }

  return c.json(updatedDeployment[0]);
})

// Deploy to production after preview has been reviewed
app.post('/:id/deploy-to-production', async (c) => {
  const id = parseInt(c.req.param('id'), 10);

  if (isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid deployment ID' });
  }

  // Get the preview deployment
  const previewDeployment = await db.query.deploymentsTable.findFirst({
    where: eq(deploymentsTable.id, id),
  });

  if (!previewDeployment) {
    throw new HTTPException(404, { message: 'Deployment not found' });
  }

  // Check if this is a preview deployment
  if (previewDeployment.environment !== 'preview') {
    throw new HTTPException(400, { message: 'Only preview deployments can be deployed to production' });
  }

  // Check if the preview deployment is completed
  if (previewDeployment.status !== 'completed') {
    throw new HTTPException(400, { message: 'Preview deployment must be completed before deploying to production' });
  }

  // Get the triggeredBy from the request body or use a default
  const { triggeredBy = 'Editor' } = await c.req.json<{ triggeredBy?: string }>().catch(() => ({}));

  // Trigger a production deployment
  try {
    const productionDeployment = await triggerGitHubAction('production', previewDeployment.releaseId, triggeredBy);
    return c.json(productionDeployment, 201);
  } catch (error: any) {
    throw new HTTPException(500, { message: `Failed to trigger production deployment: ${error.message}` });
  }
})

export default app
