-- DropForeignKey
ALTER TABLE "Companion" DROP CONSTRAINT "Companion_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayTester" DROP CONSTRAINT "PlayTester_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "PlayTester" DROP CONSTRAINT "PlayTester_userId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedRulesetPermission" DROP CONSTRAINT "PublishedRulesetPermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ruleset" DROP CONSTRAINT "Ruleset_userId_fkey";

-- AddForeignKey
ALTER TABLE "PlayTester" ADD CONSTRAINT "PlayTester_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayTester" ADD CONSTRAINT "PlayTester_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companion" ADD CONSTRAINT "Companion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRulesetPermission" ADD CONSTRAINT "PublishedRulesetPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
