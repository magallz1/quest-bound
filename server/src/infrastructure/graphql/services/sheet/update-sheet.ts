import { AuthorizationContext } from '@/infrastructure/types';
import { UpdateSheetMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';

export const updateSheet = async (
  parent: any,
  args: UpdateSheetMutationVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;

  const db = dbClient();

  const existingSheet = await db.sheet.findUnique({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      image: true,
    },
  });

  if (!existingSheet) {
    throw Error('Sheet not found.');
  }

  const sheet = await db.sheet.update({
    where: {
      id: `${input.id}-${input.rulesetId}`,
    },
    include: {
      image: true,
      backgroundImage: true,
      ruleset: {
        select: {
          title: true,
        },
      },
    },
    data: {
      rulesetId: input.rulesetId ?? undefined,
      pageId: input.pageId ?? undefined,
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      type: input.type ?? undefined,
      templateId: input.templateId ?? undefined,
      templateName: input.templateName ?? undefined,
      templateType: input.templateType ?? undefined,
      details: input.details ?? undefined,
      backgroundImageId: input.backgroundImageId,
      imageId: input.imageId,
      tabs: input.tabs ?? undefined,
    },
  });

  if (input.pageId === null && sheet.pageId !== null) {
    await db.page.update({
      where: {
        id: sheet.pageId,
      },
      data: {
        sheet: {
          disconnect: true,
        },
      },
    });
  }

  // Delete any components associated to deleted tabs
  if (input.tabs) {
    const inputTabs = JSON.parse(input.tabs);
    const existingTabs = JSON.parse(existingSheet.tabs as string) ?? [];
    const deletedTabs = existingTabs.filter(
      (tab: any) => !inputTabs.some((t: any) => t.tabId === tab.tabId),
    );

    // Delete tabs and associated components and sections
    if (deletedTabs.length > 0) {
      await db.sheetComponent.deleteMany({
        where: {
          tabId: {
            in: deletedTabs.map((tab: any) => tab.tabId),
          },
          AND: {
            sheetId: sheet.id,
          },
        },
      });
    }
  }

  return {
    ...sheet,
    username: sheet.createdBy ?? '',
    id: sheet.entityId,
    rulesetTitle: sheet.ruleset?.title ?? null,
  };
};
