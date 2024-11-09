/*
  Warnings:

  - The required column `entityId` was added to the `Attribute` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `Chart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `Page` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `PublishedAttribute` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `PublishedChart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `PublishedPage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `PublishedSheet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `PublishedSheetComponent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `Sheet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `entityId` was added to the `SheetComponent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedAttribute" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedChart" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedPage" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedSheet" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedSheetComponent" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SheetComponent" ADD COLUMN     "entityId" TEXT NOT NULL;
