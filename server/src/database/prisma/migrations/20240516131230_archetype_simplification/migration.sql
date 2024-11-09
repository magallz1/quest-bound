/*
  Warnings:

  - You are about to drop the column `height` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `isApplicable` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `isCreature` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Archetype` table. All the data in the column will be lost.
  - You are about to drop the column `archetypeIds` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `isApplicable` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `isCreature` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `PublishedArchetype` table. All the data in the column will be lost.
  - You are about to drop the `ArchetypeAttributes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublishedArchetypeAttributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Archetype" DROP CONSTRAINT "Archetype_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ArchetypeAttributes" DROP CONSTRAINT "ArchetypeAttributes_archetypeId_fkey";

-- DropForeignKey
ALTER TABLE "ArchetypeAttributes" DROP CONSTRAINT "ArchetypeAttributes_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedArchetype" DROP CONSTRAINT "PublishedArchetype_parentId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedArchetypeAttributes" DROP CONSTRAINT "PublishedArchetypeAttributes_archetypeId_fkey";

-- DropForeignKey
ALTER TABLE "PublishedArchetypeAttributes" DROP CONSTRAINT "PublishedArchetypeAttributes_attributeId_fkey";

-- AlterTable
ALTER TABLE "Archetype" DROP COLUMN "height",
DROP COLUMN "isApplicable",
DROP COLUMN "isCreature",
DROP COLUMN "parentId",
DROP COLUMN "size",
DROP COLUMN "width",
DROP COLUMN "x",
DROP COLUMN "y";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "archetypeIds";

-- AlterTable
ALTER TABLE "PublishedArchetype" DROP COLUMN "height",
DROP COLUMN "isApplicable",
DROP COLUMN "isCreature",
DROP COLUMN "parentId",
DROP COLUMN "size",
DROP COLUMN "width",
DROP COLUMN "x",
DROP COLUMN "y";

-- DropTable
DROP TABLE "ArchetypeAttributes";

-- DropTable
DROP TABLE "PublishedArchetypeAttributes";
