import { Hono } from 'hono'

import { db } from '../db/index.js';
import { eventsTable, releasesTable } from '../db/schema.js';
import type { EntryPayload } from '../db/EntryPayload.js';
import { eq } from 'drizzle-orm';
const app = new Hono()

app.post('/', async (c) => {
    try {
        const payload = await c.req.json<any>();

        console.log(`Received valid Strapi webhook event: ${payload.event} for model ${payload.model}`);

        const entryData = payload.entry as EntryPayload | undefined;

        if (!entryData || typeof entryData.id !== 'number') {
             console.warn('Webhook payload missing valid entry data or entry.id.');
             return c.json({ message: 'Webhook ignored: Missing valid entry data' }, 202);
        }

        let openRelease = await db.query.releasesTable.findFirst({
            where: eq(releasesTable.status, 'open'),
        });

        if (!openRelease) {
            console.log('No open release found. Creating a new one...');

            const newRelease = await db.insert(releasesTable).values({
                title: `Release ${new Date().toISOString().split('T')[0]}`, // Default title
                status: 'open',
            }).returning({ id: releasesTable.id });

            if (!newRelease || newRelease.length === 0) {
                 throw new Error('Failed to create a new release.');
            }
            openRelease = newRelease[0]; // Use the newly created release
            console.log(`Created new release with ID: ${openRelease?.id}`);
        } else {
             console.log(`Found open release ${openRelease.title}`);
        }

        const dataToInsert= {
            eventName: payload.event,
            model: payload.model,
            uid: payload.uid,
            eventCreatedAt: new Date(payload.createdAt),
            eventUpdatedAt: new Date(entryData.updatedAt),
            entryId: entryData.id,
            documentId: entryData.documentId ?? null,
            locale: entryData.locale ?? null,
            entryTitle: entryData.title ?? null,
            createdByFirstname: entryData.createdBy?.firstname ?? null,
            updatedByFirstname: entryData.updatedBy?.firstname ?? null,
            createdByLastname: entryData.createdBy?.lastname ?? null,
            updatedByLastname: entryData.updatedBy?.lastname ?? null,
            eventPublishedAt: entryData.publishedAt != null ? new Date(entryData.publishedAt) : null,

            entryPayload: entryData,

            releaseId: openRelease?.id,
        };

        console.log('Inserting webhook data into database...');
        await db.insert(eventsTable).values(dataToInsert);
        console.log(`✅ Successfully inserted webhook data for entry ID: ${entryData.id}`);

        return c.json({ message: 'Webhook received and stored successfully' }, 200);

    } catch (error: any) {
        console.error('Error processing Strapi webhook payload:', error);
        if (error instanceof SyntaxError) {
             return c.json({ message: 'Invalid JSON payload' }, 400);
        }

        console.error('Error during webhook processing (potentially DB):', error.message);
        return c.json({ message: 'Error processing webhook' }, 500);
    }
});

export default app
