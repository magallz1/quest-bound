/*
  Warnings:

  - You are about to drop the column `imageId` on the `PublishedRuleset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublishedRuleset" DROP CONSTRAINT "PublishedRuleset_imageId_fkey";

-- DropIndex
DROP INDEX "PublishedRuleset_imageId_key";

-- DropIndex
DROP INDEX "PublishedSheet_imageId_key";

-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "imageId";
