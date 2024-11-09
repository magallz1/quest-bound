-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
