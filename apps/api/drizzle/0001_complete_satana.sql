ALTER TABLE "strapi_webhooks" ADD COLUMN "strapi_event_updated_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "strapi_webhooks" ADD COLUMN "strapi_event_published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "strapi_webhooks" ADD COLUMN "strapi_created_by_lastname" text;--> statement-breakpoint
ALTER TABLE "strapi_webhooks" ADD COLUMN "strapi_updated_by_lastname" text;