/*
  Warnings:

  - You are about to drop the column `approved` on the `PublishedRuleset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "approved",
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "live" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PublishedRulesetPermission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "salePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tipAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
