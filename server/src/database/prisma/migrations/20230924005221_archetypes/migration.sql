-- CreateTable
CREATE TABLE "ArchetypeAttributes" (
    "id" TEXT NOT NULL,
    "archetypeId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "variation" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "ArchetypeAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archetype" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "isCreature" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Archetype_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArchetypeAttributes" ADD CONSTRAINT "ArchetypeAttributes_archetypeId_fkey" FOREIGN KEY ("archetypeId") REFERENCES "Archetype"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchetypeAttributes" ADD CONSTRAINT "ArchetypeAttributes_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archetype" ADD CONSTRAINT "Archetype_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
