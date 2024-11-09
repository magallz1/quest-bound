/*
  Warnings:

  - You are about to drop the column `entityId` on the `Ruleset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ruleset" DROP COLUMN "entityId",
ADD COLUMN     "rulesetId" TEXT;
