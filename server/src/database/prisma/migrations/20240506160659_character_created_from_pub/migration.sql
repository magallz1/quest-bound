/*
  Warnings:

  - You are about to drop the `_CharacterArchetypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_B_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "archetypeIds" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "createdFromPublishedRuleset" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_CharacterArchetypes";
