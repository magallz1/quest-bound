-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_rulesetId_fkey";

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
