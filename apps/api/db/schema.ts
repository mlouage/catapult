import { serial, text, integer, timestamp, jsonb, pgSchema } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { EntryPayload } from './EntryPayload.js';

export const catapult = pgSchema("catapult");

export const releaseStatusEnum = catapult.enum('release_status', ['open', 'closed']);
export const deploymentStatusEnum = catapult.enum('deployment_status', ['completed', 'failed', 'in_progress']);
export const environmentEnum = catapult.enum('environment', ['preview', 'production']);

export const releasesTable = catapult.table('releases', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: releaseStatusEnum('status').default('open').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  closedAt: timestamp('closed_at', { withTimezone: true, mode: 'date' }),
});

export const deploymentsTable = catapult.table('deployments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  status: deploymentStatusEnum('status').notNull(),
  environment: environmentEnum('environment').notNull(),
  githubActionUrl: text('github_action_url').notNull(),
  triggeredBy: text('triggered_by').notNull(),
  deployedAt: timestamp('deployed_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  releaseId: integer('release_id').references(() => releasesTable.id, { onDelete: 'set null' }),
});

export const releasesRelations = relations(releasesTable, ({ many }) => ({
  webhooks: many(eventsTable),
  deployments: many(deploymentsTable),
}));

export const eventsTable = catapult.table('events', {
  id: serial('id').primaryKey(),
  receivedAt: timestamp('received_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  eventName: text('event_name').notNull(), // e.g., "entry.update"
  model: text('model').notNull(), // e.g., "tag"
  uid: text('uid').notNull(), // e.g., "api::tag.tag"
  documentId: text('document_id'), // e.g., "1"
  locale: text('locale'), // e.g., "en"
  eventCreatedAt: timestamp('event_created_at', { withTimezone: true, mode: 'date' }).notNull(),
  eventUpdatedAt: timestamp('event_updated_at', { withTimezone: true, mode: 'date' }).notNull(),
  eventPublishedAt: timestamp('event_published_at', { withTimezone: true, mode: 'date' }),
  entryId: integer('entry_id').notNull(),
  entryTitle: text('entry_title'),
  createdByFirstname: text('created_by_firstname'),
  updatedByFirstname: text('updated_by_firstname'),
  createdByLastname: text('created_by_lastname'),
  updatedByLastname: text('updated_by_lastname'),

  entryPayload: jsonb('entry_payload').$type<EntryPayload>().notNull(),

  releaseId: integer('release_id').references(() => releasesTable.id, { onDelete: 'set null' }),
});

export const strapiWebhooksRelations = relations(eventsTable, ({ one }) => ({
  release: one(releasesTable, {
      fields: [eventsTable.releaseId],
      references: [releasesTable.id],
  }),
}));

export const schema = {
  releaseStatusEnum,
  releasesTable,
  releasesRelations,
  eventsTable,
  strapiWebhooksRelations,
  deploymentStatusEnum,
  environmentEnum,
  deploymentsTable,
};
