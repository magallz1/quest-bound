-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageId" TEXT,
    "logic" JSONB NOT NULL DEFAULT '[]',
    "category" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
