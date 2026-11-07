CREATE INDEX "orgs_owner_id_idx" ON "orgs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "projects_org_slug_idx" ON "projects" USING btree ("org_slug");
