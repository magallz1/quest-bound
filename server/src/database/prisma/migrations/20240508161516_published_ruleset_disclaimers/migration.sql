-- AlterTable
ALTER TABLE "PublishedRuleset" ADD COLUMN     "includesAI" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includesPDF" BOOLEAN NOT NULL DEFAULT false;
