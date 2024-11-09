-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "PublishedAttribute" ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{}';
