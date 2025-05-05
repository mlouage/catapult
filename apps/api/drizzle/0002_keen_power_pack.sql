CREATE TYPE "catapult"."deployment_status" AS ENUM('completed', 'failed', 'in_progress');--> statement-breakpoint
CREATE TYPE "catapult"."environment" AS ENUM('preview', 'production');--> statement-breakpoint
CREATE TABLE "catapult"."deployments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" "catapult"."deployment_status" NOT NULL,
	"environment" "catapult"."environment" NOT NULL,
	"github_action_url" text NOT NULL,
	"triggered_by" text NOT NULL,
	"deployed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"release_id" integer
);
--> statement-breakpoint
ALTER TABLE "catapult"."deployments" ADD CONSTRAINT "deployments_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "catapult"."releases"("id") ON DELETE set null ON UPDATE no action;