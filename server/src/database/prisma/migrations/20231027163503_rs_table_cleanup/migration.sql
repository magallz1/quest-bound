/*
  Warnings:

  - You are about to drop the column `dependenciesArePublic` on the `PublishedRuleset` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `PublishedRuleset` table. All the data in the column will be lost.
  - You are about to drop the column `modulePermissions` on the `PublishedRuleset` table. All the data in the column will be lost.
  - You are about to drop the column `dependenciesArePublic` on the `Ruleset` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Ruleset` table. All the data in the column will be lost.
  - You are about to drop the column `modulePermissions` on the `Ruleset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PublishedRuleset" DROP COLUMN "dependenciesArePublic",
DROP COLUMN "isPublic",
DROP COLUMN "modulePermissions";

-- AlterTable
ALTER TABLE "Ruleset" DROP COLUMN "dependenciesArePublic",
DROP COLUMN "isPublic",
DROP COLUMN "modulePermissions";
