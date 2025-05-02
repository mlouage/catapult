CREATE TABLE "strapi_webhooks" (
	"id" serial PRIMARY KEY NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"strapi_event" text NOT NULL,
	"strapi_model" text NOT NULL,
	"strapi_uid" text NOT NULL,
	"strapi_event_created_at" timestamp with time zone NOT NULL,
	"strapi_entry_id" integer NOT NULL,
	"strapi_entry_title" text,
	"strapi_created_by_firstname" text,
	"strapi_updated_by_firstname" text,
	"entry_payload" jsonb NOT NULL
);
