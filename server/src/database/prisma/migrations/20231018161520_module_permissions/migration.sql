-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "modulePermissions" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "rulesetPermissions" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "modulePermissions" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "rulesetPermissions" JSONB NOT NULL DEFAULT '{}';
