import { Hono } from 'hono'

const app = new Hono()

app.post('/', async (c) => {
  try {
      // Hono automatically parses JSON if Content-Type is correct
      const payload: any = await c.req.json(); // Type assertion if you have payload types

      console.log(`Received valid Strapi webhook event: ${payload.event} for model ${payload.model}`);
      // console.log('Full Payload:', JSON.stringify(payload, null, 2)); // Log full payload if needed for debugging

      // --- TODO: Add your logic to process the webhook payload ---
      // Example: Invalidate a cache, trigger a notification, update search index, etc.
      switch (`${payload.event}:${payload.model}`) {
          case 'entry.update:tag':
          case 'entry.create:tag':
              console.log(`Processing tag update/create: ID=${payload.entry.id}, Title=${payload.entry.title}`);
              // Call function to update cache for tags, etc.
              break;
          case 'entry.delete:article':
              console.log(`Processing article delete: ID=${payload.entry.id}`);
              // Call function to handle article deletion side-effects
              break;
          // Add more cases for events and models you care about
          default:
              console.log(`Ignoring webhook event: ${payload.event}:${payload.model}`);
      }
      // --- End TODO ---

      // Send a success response back to Strapi
      return c.json({ message: 'Webhook received successfully' }, 200);

  } catch (error: any) {
      console.error('Error processing Strapi webhook payload:', error);
      if (error instanceof SyntaxError) {
           // JSON parsing error
           return c.json({ message: 'Invalid JSON payload' }, 400);
      }
      // Generic server error for other issues
      return c.json({ message: 'Error processing webhook' }, 500);
  }
});

export default app
