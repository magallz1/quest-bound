import { dbClient, supabaseClient } from '@/database';
import { PublishRuleset } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput, ResourceLimit } from '@/infrastructure/types';
import { v4 as uuidv4 } from 'uuid';
import { throwIfLimitExceeded } from '../../_shared';

/**
 * Copies a ruleset and all its associations to the published tables
 */
export const publishRuleset = async (
  parent: any,
  args: ResolverInput<PublishRuleset>,
  context: AuthorizationContext,
) => {
  const { userRole, userId } = context;
  const { input } = args;

  const db = dbClient();
  const supabase = supabaseClient();

  const existingPublications = await db.publishedRuleset.findMany({
    where: {
      userId,
    },
  });

  throwIfLimitExceeded({
    role: userRole,
    existingCount: existingPublications.length,
    resource: ResourceLimit.PUBLICATION,
  });

  const ruleset = await db.ruleset.findUnique({
    where: { id: input.id },
    include: {
      attributes: true,
      archetypes: true,
      image: true,
      user: true,
      sheets: {
        include: {
          image: true,
          backgroundImage: true,
          page: {
            select: {
              characterId: true,
            },
          },
          components: {
            include: {
              images: true,
            },
          },
        },
      },
      charts: true,
      pages: true,
      documents: true,
    },
  });

  if (!ruleset) {
    throw Error('Ruleset not found');
  }

  const sheetComponents = ruleset.sheets
    .filter((s: any) => !s.page?.characterId)
    .flatMap((sheet: any) => sheet.components);

  const documentFileKeyMap = new Map<string, string>();

  let publishedDocumentIds: string[] = [];
  if (ruleset.isModule && ruleset.publishedRulesetId) {
    const publishedRuleset = await db.publishedRuleset.findUnique({
      where: {
        id: ruleset.publishedRulesetId,
      },
      include: {
        documents: true,
      },
    });

    publishedDocumentIds =
      publishedRuleset?.documents.map((document: any) => document.entityId) ?? [];
  }

  // Only create new files for new rulesets and documents added to new modules
  // Otherwise, the document will reference the file associated to the published ruleset to avoid duplication
  const newlyCreatedDocuments = ruleset.documents.filter(
    (document: any) => !publishedDocumentIds.includes(document.entityId),
  );

  // Copy all document files
  for (const document of newlyCreatedDocuments) {
    if (document.fileKey) {
      const newFileKey = `${uuidv4()}-${document.title}`;
      const { error } = await supabase.storage.from('documents').copy(document.fileKey, newFileKey);
      if (!error) {
        documentFileKeyMap.set(document.fileKey, newFileKey);
      }
    }
  }

  const publishedRuleset = await db.publishedRuleset.create({
    data: {
      id: ruleset.id,
      userId: ruleset.userId,
      createdBy: ruleset.createdBy,
      live: false,
      createdById: ruleset.createdById,
      title: ruleset.title,
      description: ruleset.description ?? undefined,
      details: ruleset.details ?? undefined,
      isModule: ruleset.isModule,
      rulesetId: ruleset.rulesetId ?? undefined,
      rulesetTitle: ruleset.rulesetTitle,
      rulesetPermissions: ruleset.rulesetPermissions ?? undefined,
      version: input.version,
      userPermissions: {
        create: {
          userId: ruleset.user.id,
          type: 'OWNER',
          version: input.version,
        },
      },
      ...(ruleset.image && {
        image: {
          connect: {
            id: ruleset.image.id,
          },
        },
      }),
      attributes: {
        createMany: {
          data: ruleset.attributes.map((attribute: any) => ({
            id: attribute.id,
            entityId: attribute.entityId,
            moduleId: attribute.moduleId ?? undefined,
            moduleTitle: attribute.moduleTitle ?? undefined,
            sortChildId: attribute.sortChildId,
            name: attribute.name,
            type: attribute.type,
            category: attribute.category,
            defaultValue: attribute.defaultValue ?? undefined,
            description: attribute.description ?? undefined,
            minValue: attribute.minValue ?? undefined,
            maxValue: attribute.maxValue ?? undefined,
            restraints: attribute.restraints ?? undefined,
            logic: attribute.logic ?? undefined,
          })),
        },
      },
      archetypes: {
        createMany: {
          data: ruleset.archetypes.map((archetype: any) => ({
            id: archetype.id,
            entityId: archetype.entityId,
            moduleId: archetype.moduleId ?? undefined,
            moduleTitle: archetype.moduleTitle ?? undefined,
            title: archetype.title ?? undefined,
            description: archetype.description ?? undefined,
            imageId: archetype.imageId ?? undefined,
            parentId: archetype.parentId ?? undefined,
            size: archetype.size ?? undefined,
            isCreature: archetype.isCreature ?? undefined,
            isApplicable: archetype.isApplicable ?? undefined,
          })),
        },
      },
      pages: {
        createMany: {
          data: ruleset.pages
            .filter((p: any) => !p.characterId)
            .map((page: any) => ({
              id: page.id,
              entityId: page.entityId,
              title: page.title,
              moduleTitle: page.moduleTitle ?? undefined,
              moduleId: page.moduleId ?? undefined,
              details: page.details ?? undefined,
              content: page.content ?? undefined,
              parentId: page.parentId ?? undefined,
              sortIndex: page.sortIndex,
            })),
        },
      },
      charts: {
        createMany: {
          data: ruleset.charts.map((chart: any) => ({
            id: chart.id,
            entityId: chart.entityId,
            data: chart.data ?? undefined,
            title: chart.title,
            moduleId: chart.moduleId ?? undefined,
            moduleTitle: chart.moduleTitle ?? undefined,
            fileKey: chart.fileKey,
          })),
        },
      },
      documents: {
        createMany: {
          data: ruleset.documents.map((document: any) => ({
            id: document.id,
            entityId: document.entityId,
            moduleTitle: document.moduleTitle ?? undefined,
            moduleId: document.moduleId ?? undefined,
            fileKey: documentFileKeyMap.get(document.fileKey) ?? document.fileKey, // Use the new file key if it was copied
            description: document.description ?? undefined,
            title: document.title,
          })),
        },
      },
    },
    include: {
      image: true,
    },
  });

  // Create sheets after pages for association
  await db.publishedSheet.createMany({
    data: ruleset.sheets
      .filter((s: any) => !s.page?.characterId)
      .map((sheet: any) => ({
        id: sheet.id,
        rulesetId: ruleset.id,
        entityId: sheet.entityId,
        pageId: sheet.pageId,
        title: sheet.title,
        description: sheet.description ?? undefined,
        moduleTitle: sheet.moduleTitle ?? undefined,
        moduleId: sheet.moduleId ?? undefined,
        templateType: sheet.templateType,
        tabs: sheet.tabs ?? undefined,
        sections: sheet.sections ?? undefined,
        templateId: sheet.templateId,
        type: sheet.type,
        templateName: sheet.templateName,
        details: sheet.details ?? undefined,
        imageId: sheet.image?.id,
        backgroundImageId: sheet.backgroundImage?.id,
      })),
  });

  await db.publishedSheetComponent.createMany({
    data: sheetComponents.map((component: any) => ({
      id: component.id,
      sheetId: component.sheetId,
      tabId: component.tabId,
      groupId: component.groupId ?? undefined,
      type: component.type,
      label: component.label,
      description: component.description ?? undefined,
      layer: component.layer,
      style: component.style ?? undefined,
      data: component.data ?? undefined,
      locked: component.locked,
      x: component.x,
      y: component.y,
      width: component.width,
      height: component.height,
      rotation: component.rotation,
    })),
  });

  await db.publishedComponentImages.createMany({
    data: sheetComponents.flatMap((component: any) =>
      component.images.map((image: any) => ({
        imageId: image.imageId,
        componentId: component.id,
      })),
    ),
  });

  return {
    ...publishedRuleset,
    username: ruleset.user.username,
    userId: ruleset.user.id,
    published: true,
  };
};
