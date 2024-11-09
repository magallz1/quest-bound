-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "bootstrapped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PublishedPage" ADD COLUMN     "bootstrapped" BOOLEAN NOT NULL DEFAULT false;
