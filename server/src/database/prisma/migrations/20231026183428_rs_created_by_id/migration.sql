-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "createdById" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "createdById" TEXT NOT NULL DEFAULT '';
