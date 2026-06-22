-- Production DB was created before migrations; baseline marked init as applied without this column.
ALTER TABLE "Invitation" ADD COLUMN IF NOT EXISTS "templateSnapshot" JSONB;

-- Template.views was added in the same era; safe no-op if already present.
ALTER TABLE "Template" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
