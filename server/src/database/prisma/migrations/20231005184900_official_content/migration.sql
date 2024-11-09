-- CreateTable
CREATE TABLE "OfficialContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "OfficialContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfficialContent_key_key" ON "OfficialContent"("key");
