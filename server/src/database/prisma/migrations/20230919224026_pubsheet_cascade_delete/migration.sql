-- DropForeignKey
ALTER TABLE "PublishedSheet" DROP CONSTRAINT "PublishedSheet_rulesetId_fkey";

-- AddForeignKey
ALTER TABLE "PublishedSheet" ADD CONSTRAINT "PublishedSheet_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
