/*
  Warnings:

  - You are about to drop the column `published` on the `PublishedRuleset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "published",
ADD COLUMN     "listed" BOOLEAN NOT NULL DEFAULT false;
