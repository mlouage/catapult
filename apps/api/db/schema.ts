import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export type StrapiEntryPayload = {
  id: number;
  documentId: string;
  title?: string | null; // Optional
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string | null; // ISO date string
  createdBy?: {
    id?: number; // Assuming ID might be there sometimes
    documentId?: string;
    firstname?: string | null;
    lastname?: string | null;
  } | null; // Optional
  updatedBy?: {
     id?: number;
     documentId?: string;
     firstname?: string | null;
     lastname?: string | null;
  } | null; // Optional
  [key: string]: any; // Allow other arbitrary fields
};

// Define the table for storing webhook events
export const strapiWebhooksTable = pgTable('strapi_webhooks', {
  // Core columns
  id: serial('id').primaryKey(), // Auto-incrementing primary key
  receivedAt: timestamp('received_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(), // When we received the webhook

  // Structured data from the webhook payload
  strapiEvent: text('strapi_event').notNull(), // e.g., "entry.update"
  strapiModel: text('strapi_model').notNull(), // e.g., "tag"
  strapiUid: text('strapi_uid').notNull(), // e.g., "api::tag.tag"
  strapiEventCreatedAt: timestamp('strapi_event_created_at', { withTimezone: true, mode: 'date' }).notNull(), // Top-level createdAt from payload
  strapiEventUpdatedAt: timestamp('strapi_event_updated_at', { withTimezone: true, mode: 'date' }).notNull(), // Top-level updatedAt from payload
  strapiEventPublishedAt: timestamp('strapi_event_published_at', { withTimezone: true, mode: 'date' }), // Top-level publishedAt from payload

  // Structured data from the 'entry' object (nullable where needed)
  strapiEntryId: integer('strapi_entry_id').notNull(), // entry.id
  strapiEntryTitle: text('strapi_entry_title'), // entry.title (nullable)
  strapiCreatedByFirstname: text('strapi_created_by_firstname'), // entry.createdBy.firstname (nullable)
  strapiUpdatedByFirstname: text('strapi_updated_by_firstname'), // entry.updatedBy.firstname (nullable)
  strapiCreatedByLastname: text('strapi_created_by_lastname'), // entry.createdBy.lastname (nullable)
  strapiUpdatedByLastname: text('strapi_updated_by_lastname'), // entry.updatedBy.lastname (nullable)

  // The full 'entry' payload stored as JSONB
  entryPayload: jsonb('entry_payload').$type<StrapiEntryPayload>().notNull(),
});
