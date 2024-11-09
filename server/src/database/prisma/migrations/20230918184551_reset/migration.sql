-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PLAYER', 'CREATOR', 'BUILDER');

-- CreateEnum
CREATE TYPE "SheetType" AS ENUM ('SHEET', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('PAGE', 'SHEET');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "authId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "stripeId" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "storageAllotment" INTEGER NOT NULL DEFAULT 100,
    "onboarded" BOOLEAN NOT NULL DEFAULT false,
    "avatarId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companion" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "description" TEXT,
    "color" TEXT,
    "animal" TEXT,
    "imageId" TEXT,

    CONSTRAINT "Companion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "src" TEXT,
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentImages" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "ComponentImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "id" TEXT NOT NULL,
    "isModule" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "imageId" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "defaultValue" TEXT NOT NULL,
    "restraints" TEXT[],
    "logic" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "title" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "title" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL DEFAULT '{}',
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "pageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT,
    "templateName" TEXT,
    "type" "SheetType" NOT NULL,
    "templateType" "TemplateType",
    "title" TEXT NOT NULL,
    "imageId" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "details" JSONB NOT NULL DEFAULT '{}',
    "backgroundImageId" TEXT,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetTab" (
    "id" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SheetTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetSection" (
    "uniqueSectionId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "height" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "desktopX" INTEGER NOT NULL DEFAULT 0,
    "desktopY" INTEGER NOT NULL DEFAULT 0,
    "tabletX" INTEGER NOT NULL DEFAULT 0,
    "tabletY" INTEGER NOT NULL DEFAULT 0,
    "mobileX" INTEGER NOT NULL DEFAULT 0,
    "mobileY" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SheetSection_pkey" PRIMARY KEY ("uniqueSectionId")
);

-- CreateTable
CREATE TABLE "SheetComponent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "layer" INTEGER NOT NULL,
    "style" JSONB NOT NULL DEFAULT '{}',
    "data" JSONB NOT NULL DEFAULT '{}',
    "tabId" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "rotation" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SheetComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedRulesetImages" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "PublishedRulesetImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedSheetImages" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "PublishedSheetImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedComponentImages" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "PublishedComponentImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedRulesetPermission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "PublishedRulesetPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedRuleset" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isModule" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "PublishedRuleset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedAttribute" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "defaultValue" TEXT NOT NULL,
    "restraints" TEXT[],
    "logic" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "PublishedAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedSheet" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "pageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT,
    "templateName" TEXT,
    "type" "SheetType" NOT NULL,
    "templateType" "TemplateType",
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "details" JSONB NOT NULL DEFAULT '{}',
    "backgroundImageId" TEXT,

    CONSTRAINT "PublishedSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedSheetTab" (
    "id" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PublishedSheetTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedSheetSection" (
    "uniqueSectionId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "height" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "desktopX" INTEGER NOT NULL DEFAULT 0,
    "desktopY" INTEGER NOT NULL DEFAULT 0,
    "tabletX" INTEGER NOT NULL DEFAULT 0,
    "tabletY" INTEGER NOT NULL DEFAULT 0,
    "mobileX" INTEGER NOT NULL DEFAULT 0,
    "mobileY" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PublishedSheetSection_pkey" PRIMARY KEY ("uniqueSectionId")
);

-- CreateTable
CREATE TABLE "PublishedSheetComponent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "layer" INTEGER NOT NULL,
    "style" JSONB NOT NULL DEFAULT '{}',
    "data" JSONB NOT NULL DEFAULT '{}',
    "tabId" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "groupId" TEXT,
    "x" INTEGER NOT NULL DEFAULT 0,
    "y" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "rotation" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PublishedSheetComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedPage" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rulesetId" TEXT NOT NULL,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "title" TEXT NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL DEFAULT '{}',
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,

    CONSTRAINT "PublishedPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedChart" (
    "id" TEXT NOT NULL,
    "rulesetId" TEXT,
    "moduleId" TEXT,
    "moduleTitle" TEXT,
    "title" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,

    CONSTRAINT "PublishedChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConnectedAttributes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RulesetModules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PublishedConnectedAttributes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeId_key" ON "User"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "Companion_userId_key" ON "Companion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Companion_imageId_key" ON "Companion"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Ruleset_imageId_key" ON "Ruleset"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_pageId_key" ON "Sheet"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_imageId_key" ON "Sheet"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedSheet_pageId_key" ON "PublishedSheet"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "_ConnectedAttributes_AB_unique" ON "_ConnectedAttributes"("A", "B");

-- CreateIndex
CREATE INDEX "_ConnectedAttributes_B_index" ON "_ConnectedAttributes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RulesetModules_AB_unique" ON "_RulesetModules"("A", "B");

-- CreateIndex
CREATE INDEX "_RulesetModules_B_index" ON "_RulesetModules"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PublishedConnectedAttributes_AB_unique" ON "_PublishedConnectedAttributes"("A", "B");

-- CreateIndex
CREATE INDEX "_PublishedConnectedAttributes_B_index" ON "_PublishedConnectedAttributes"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companion" ADD CONSTRAINT "Companion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companion" ADD CONSTRAINT "Companion_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentImages" ADD CONSTRAINT "ComponentImages_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "SheetComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentImages" ADD CONSTRAINT "ComponentImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attribute" ADD CONSTRAINT "Attribute_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_backgroundImageId_fkey" FOREIGN KEY ("backgroundImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetTab" ADD CONSTRAINT "SheetTab_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSection" ADD CONSTRAINT "SheetSection_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetComponent" ADD CONSTRAINT "SheetComponent_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRulesetImages" ADD CONSTRAINT "PublishedRulesetImages_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRulesetImages" ADD CONSTRAINT "PublishedRulesetImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheetImages" ADD CONSTRAINT "PublishedSheetImages_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "PublishedSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheetImages" ADD CONSTRAINT "PublishedSheetImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedComponentImages" ADD CONSTRAINT "PublishedComponentImages_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "PublishedSheetComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedComponentImages" ADD CONSTRAINT "PublishedComponentImages_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRulesetPermission" ADD CONSTRAINT "PublishedRulesetPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRulesetPermission" ADD CONSTRAINT "PublishedRulesetPermission_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRuleset" ADD CONSTRAINT "PublishedRuleset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedAttribute" ADD CONSTRAINT "PublishedAttribute_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheet" ADD CONSTRAINT "PublishedSheet_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheet" ADD CONSTRAINT "PublishedSheet_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "PublishedPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheet" ADD CONSTRAINT "PublishedSheet_backgroundImageId_fkey" FOREIGN KEY ("backgroundImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheetTab" ADD CONSTRAINT "PublishedSheetTab_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "PublishedSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheetSection" ADD CONSTRAINT "PublishedSheetSection_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "PublishedSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedSheetComponent" ADD CONSTRAINT "PublishedSheetComponent_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "PublishedSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPage" ADD CONSTRAINT "PublishedPage_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedPage" ADD CONSTRAINT "PublishedPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PublishedPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedChart" ADD CONSTRAINT "PublishedChart_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectedAttributes" ADD CONSTRAINT "_ConnectedAttributes_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConnectedAttributes" ADD CONSTRAINT "_ConnectedAttributes_B_fkey" FOREIGN KEY ("B") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RulesetModules" ADD CONSTRAINT "_RulesetModules_A_fkey" FOREIGN KEY ("A") REFERENCES "PublishedRuleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RulesetModules" ADD CONSTRAINT "_RulesetModules_B_fkey" FOREIGN KEY ("B") REFERENCES "Ruleset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedConnectedAttributes" ADD CONSTRAINT "_PublishedConnectedAttributes_A_fkey" FOREIGN KEY ("A") REFERENCES "PublishedAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedConnectedAttributes" ADD CONSTRAINT "_PublishedConnectedAttributes_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
