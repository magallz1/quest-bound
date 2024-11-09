-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "moduleId" TEXT,
ADD COLUMN     "moduleTitle" TEXT;

-- AlterTable
ALTER TABLE "PublishedDocument" ADD COLUMN     "moduleId" TEXT,
ADD COLUMN     "moduleTitle" TEXT;
