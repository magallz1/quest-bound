-- AlterTable
ALTER TABLE "PublishedAttribute" ADD COLUMN     "modifiers" JSONB NOT NULL DEFAULT '[]';
