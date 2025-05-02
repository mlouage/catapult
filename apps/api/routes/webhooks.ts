import { Hono } from 'hono'

import { db } from '../db/index.js';
import { eventsTable } from '../db/schema.js';
import type { EntryPayload } from '../db/EntryPayload.js';
const app = new Hono()

app.post('/', async (c) => {
    try {
        const payload = await c.req.json<any>(); // Get payload, maybe add a more specific root type

        console.log(`Received valid Strapi webhook event: ${payload.event} for model ${payload.model}`);

        // --- Prepare data for insertion ---
        const entryData = payload.entry as EntryPayload | undefined; // Cast entry for type safety

        if (!entryData || typeof entryData.id !== 'number') {
             console.warn('Webhook payload missing valid entry data or entry.id.');
             // Decide how to handle: ignore, or return error?
             return c.json({ message: 'Webhook ignored: Missing valid entry data' }, 202); // 202 Accepted but not processed
        }

        const dataToInsert= {
            eventName: payload.event,
            model: payload.model,
            uid: payload.uid,
            eventCreatedAt: new Date(payload.createdAt),
            eventUpdatedAt: new Date(entryData.updatedAt),
            entryId: entryData.id,

            // Use optional chaining for potentially missing fields
            entryTitle: entryData.title ?? null,
            createdByFirstname: entryData.createdBy?.firstname ?? null,
            updatedByFirstname: entryData.updatedBy?.firstname ?? null,
            createdByLastname: entryData.createdBy?.lastname ?? null,
            updatedByLastname: entryData.updatedBy?.lastname ?? null,
            eventPublishedAt: entryData.publishedAt != null ? new Date(entryData.publishedAt) : null,

            // Store the full entry object in the JSONB column
            entryPayload: entryData,
        };

        // --- Insert data into Postgres using Drizzle ---
        console.log('Inserting webhook data into database...');
        await db.insert(eventsTable).values(dataToInsert);
        console.log(`✅ Successfully inserted webhook data for entry ID: ${entryData.id}`);
        // --- End DB Insertion ---

        // Send a success response back to Strapi
        return c.json({ message: 'Webhook received and stored successfully' }, 200);

    } catch (error: any) {
        console.error('Error processing Strapi webhook payload:', error);
        if (error instanceof SyntaxError) {
             return c.json({ message: 'Invalid JSON payload' }, 400);
        }

        // Log DB errors specifically if possible
        // Drizzle might throw specific error types, check its documentation
        console.error('Error during webhook processing (potentially DB):', error.message);
        return c.json({ message: 'Error processing webhook' }, 500);
    }
});

export default app
