/*
  Warnings:

  - You are about to drop the column `modifiers` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `modifiers` on the `PublishedAttribute` table. All the data in the column will be lost.
  - You are about to drop the `_AttributeToCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConnectedAttributes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PublishedConnectedAttributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AttributeToCharacter" DROP CONSTRAINT "_AttributeToCharacter_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttributeToCharacter" DROP CONSTRAINT "_AttributeToCharacter_B_fkey";

-- DropForeignKey
ALTER TABLE "_ConnectedAttributes" DROP CONSTRAINT "_ConnectedAttributes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConnectedAttributes" DROP CONSTRAINT "_ConnectedAttributes_B_fkey";

-- DropForeignKey
ALTER TABLE "_PublishedConnectedAttributes" DROP CONSTRAINT "_PublishedConnectedAttributes_A_fkey";

-- DropForeignKey
ALTER TABLE "_PublishedConnectedAttributes" DROP CONSTRAINT "_PublishedConnectedAttributes_B_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "modifiers";

-- AlterTable
ALTER TABLE "PublishedAttribute" DROP COLUMN "modifiers";

-- DropTable
DROP TABLE "_AttributeToCharacter";

-- DropTable
DROP TABLE "_ConnectedAttributes";

-- DropTable
DROP TABLE "_PublishedConnectedAttributes";
