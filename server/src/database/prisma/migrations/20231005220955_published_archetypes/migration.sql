-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterArchetypes" DROP CONSTRAINT "_CharacterArchetypes_B_fkey";

-- CreateTable
CREATE TABLE "PublishedArchetypeAttributes" (
    "archetypeId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "variation" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PublishedArchetypeAttributes_pkey" PRIMARY KEY ("archetypeId","attributeId")
);

-- CreateTable
CREATE TABLE "PublishedArchetype" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "isCreature" BOOLEAN NOT NULL DEFAULT false,
    "isApplicable" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "size" INTEGER NOT NULL DEFAULT 1,
    "imageId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "PublishedArchetype_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PublishedArchetypeAttributes" ADD CONSTRAINT "PublishedArchetypeAttributes_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "PublishedArchetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedArchetypeAttributes" ADD CONSTRAINT "PublishedArchetypeAttributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "PublishedAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedArchetype" ADD CONSTRAINT "PublishedArchetype_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedArchetype" ADD CONSTRAINT "PublishedArchetype_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedArchetype" ADD CONSTRAINT "PublishedArchetype_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PublishedArchetype"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterArchetypes" ADD CONSTRAINT "_CharacterArchetypes_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedArchetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;
