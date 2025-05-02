CREATE SCHEMA IF NOT EXISTS "catapult";
--> statement-breakpoint
CREATE TYPE "catapult"."release_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "catapult"."events" (
	"id" serial PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_name" text NOT NULL,
	"model" text NOT NULL,
	"uid" text NOT NULL,
	"event_created_at" timestamp with time zone NOT NULL,
	"event_updated_at" timestamp with time zone NOT NULL,
	"event_published_at" timestamp with time zone,
	"entry_id" integer NOT NULL,
	"entry_title" text,
	"created_by_firstname" text,
	"updated_by_firstname" text,
	"created_by_lastname" text,
	"updated_by_lastname" text,
	"entry_payload" jsonb NOT NULL,
	"release_id" integer
);
--> statement-breakpoint
CREATE TABLE "catapult"."releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "catapult"."release_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "catapult"."events" ADD CONSTRAINT "events_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "catapult"."releases"("id") ON DELETE set null ON UPDATE no action;
