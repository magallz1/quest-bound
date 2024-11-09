/*
  Warnings:

  - You are about to drop the `_ModuleDependencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModuleDependencies" DROP CONSTRAINT "_ModuleDependencies_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModuleDependencies" DROP CONSTRAINT "_ModuleDependencies_B_fkey";

-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "dependenciesArePublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ruleset" ADD COLUMN     "dependenciesArePublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_ModuleDependencies";
