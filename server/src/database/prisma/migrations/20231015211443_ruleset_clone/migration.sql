/*
  Warnings:

  - You are about to drop the `PublishedComponentImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublishedRulesetImages` table. If the table is not empty, all the data it contains will be lost.
  - The required column `entityId` was added to the `Ruleset` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PublishedComponentImages" DROP CONSTRAINT "PublishedComponentImages_componentId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedComponentImages" DROP CONSTRAINT "PublishedComponentImages_imageId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedRulesetImages" DROP CONSTRAINT "PublishedRulesetImages_imageId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedRulesetImages" DROP CONSTRAINT "PublishedRulesetImages_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "_RulesetModules" DROP CONSTRAINT "_RulesetModules_A_fkey";

-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "publishedRulesetId" TEXT;

-- DropTable
DROP TABLE "PublishedComponentImages";

-- DropTable
DROP TABLE "PublishedRulesetImages";

-- CreateTable
CREATE TABLE "_ImageToPublishedSheetComponent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PublishedRulesetModules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToPublishedSheetComponent_AB_unique" ON "_ImageToPublishedSheetComponent"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToPublishedSheetComponent_B_index" ON "_ImageToPublishedSheetComponent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PublishedRulesetModules_AB_unique" ON "_PublishedRulesetModules"("A", "B");

-- CreateIndex
CREATE INDEX "_PublishedRulesetModules_B_index" ON "_PublishedRulesetModules"("B");

-- AddForeignKey
ALTER TABLE "PublishedRuleset" ADD CONSTRAINT "PublishedRuleset_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToPublishedSheetComponent" ADD CONSTRAINT "_ImageToPublishedSheetComponent_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToPublishedSheetComponent" ADD CONSTRAINT "_ImageToPublishedSheetComponent_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedSheetComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RulesetModules" ADD CONSTRAINT "_RulesetModules_A_fkey" FOREIGN KEY ("A") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedRulesetModules" ADD CONSTRAINT "_PublishedRulesetModules_A_fkey" FOREIGN KEY ("A") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedRulesetModules" ADD CONSTRAINT "_PublishedRulesetModules_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
