-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedDocument" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "PublishedDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedDocument" ADD CONSTRAINT "PublishedDocument_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
