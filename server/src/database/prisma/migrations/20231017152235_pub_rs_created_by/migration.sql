/*
  Warnings:

  - You are about to drop the column `listed` on the `PublishedRuleset` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `PublishedRuleset` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `PublishedRuleset` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `PublishedRuleset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "listed",
DROP COLUMN "price",
DROP COLUMN "username",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
