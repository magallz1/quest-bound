/*
  Warnings:

  - A unique constraint covering the columns `[characterId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Archetype" ADD COLUMN     "isApplicable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "characterId" TEXT;

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageId" TEXT,
    "attributeData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeToCharacter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CharacterArchetypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeToCharacter_AB_unique" ON "_AttributeToCharacter"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeToCharacter_B_index" ON "_AttributeToCharacter"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterArchetypes_AB_unique" ON "_CharacterArchetypes"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterArchetypes_B_index" ON "_CharacterArchetypes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_characterId_key" ON "Sheet"("characterId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToCharacter" ADD CONSTRAINT "_AttributeToCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeToCharacter" ADD CONSTRAINT "_AttributeToCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
