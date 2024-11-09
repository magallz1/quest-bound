/*
  Warnings:

  - You are about to drop the column `userId` on the `PublishedRuleset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PublishedRuleset" DROP CONSTRAINT "PublishedRuleset_userId_fkey";

-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "userId";
