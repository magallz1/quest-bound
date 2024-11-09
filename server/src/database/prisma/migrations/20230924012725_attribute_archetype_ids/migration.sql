/*
  Warnings:

  - The primary key for the `ArchetypeAttributes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ArchetypeAttributes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArchetypeAttributes" DROP CONSTRAINT "ArchetypeAttributes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ArchetypeAttributes_pkey" PRIMARY KEY ("archetypeId", "attributeId");
