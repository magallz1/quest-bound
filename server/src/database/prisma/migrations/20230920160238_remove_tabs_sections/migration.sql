/*
  Warnings:

  - You are about to drop the `PublishedSheetSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublishedSheetTab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SheetSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SheetTab` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublishedSheetSection" DROP CONSTRAINT "PublishedSheetSection_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedSheetTab" DROP CONSTRAINT "PublishedSheetTab_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "SheetSection" DROP CONSTRAINT "SheetSection_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "SheetTab" DROP CONSTRAINT "SheetTab_sheetId_fkey";

-- AlterTable
ALTER TABLE "PublishedSheet" ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "tabs" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "tabs" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "PublishedSheetSection";

-- DropTable
DROP TABLE "PublishedSheetTab";

-- DropTable
DROP TABLE "SheetSection";

-- DropTable
DROP TABLE "SheetTab";

-- CreateTable
CREATE TABLE "_ModuleDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ModuleDependencies_AB_unique" ON "_ModuleDependencies"("A", "B");

-- CreateIndex
CREATE INDEX "_ModuleDependencies_B_index" ON "_ModuleDependencies"("B");

-- AddForeignKey
ALTER TABLE "_ModuleDependencies" ADD CONSTRAINT "_ModuleDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleDependencies" ADD CONSTRAINT "_ModuleDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
