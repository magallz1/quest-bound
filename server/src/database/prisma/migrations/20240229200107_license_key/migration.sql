-- CreateTable
CREATE TABLE "LicenseKey" (
    "key" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_email_key" ON "LicenseKey"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_userId_key" ON "LicenseKey"("userId");

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
