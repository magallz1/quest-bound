import { v4 as uuidv4 } from 'uuid';
import { CreateSheetMutationVariables, SheetType } from '../../generated-types';
import { AuthorizationContext } from '@/infrastructure/types';
import { dbClient } from '@/database';
import { createSheetFromTemplate } from '../_shared';

export const createSheet = async (
  parent: any,
  args: CreateSheetMutationVariables,
  context: AuthorizationContext,
) => {
  const { input } = args;

  const db = dbClient();

  const inputTabs = input.tabs ?? [
    {
      title: 'New Page',
      position: 0,
      tabId: uuidv4(),
    },
  ];

  if (!input.templateId) {
    const entityId = uuidv4();

    const sheet = await db.sheet.create({
      data: {
        id: `${entityId}-${input.rulesetId}`,
        entityId,
        ...(input.imageId && {
          image: {
            connect: {
              id: input.imageId ?? undefined,
            },
          },
        }),
        version: 1,
        ...(input.rulesetId && {
          ruleset: {
            connect: {
              id: input.rulesetId ?? undefined,
            },
          },
        }),
        title: input.title ?? 'New Sheet Template',
        type: SheetType.TEMPLATE,
        ...(input.pageId && {
          page: {
            connect: {
              id: input.pageId ?? undefined,
            },
          },
        }),
        templateType: input.templateType,
        description: input.description ?? '',
        details: input.details ?? '{}',
        tabs: JSON.stringify(inputTabs),
        ...(input.backgroundImageId && {
          backgroundImage: {
            connect: {
              id: input.backgroundImageId,
            },
          },
        }),
      },
      include: {
        image: true,
        backgroundImage: true,
      },
    });

    return {
      ...sheet,
      username: sheet.createdBy ?? '',
      id: sheet.entityId,
    };
  }

  const sheetFromTemplate = await createSheetFromTemplate({
    db,
    rulesetId: input.rulesetId ?? '',
    templateId: input.templateId,
    overrides: {
      title: input.title,
      description: input.description,
      details: input.details,
    },
  });

  return sheetFromTemplate;
};
