import { AuthorizationContext } from '@/infrastructure/types';
import { SheetTemplatesQueryVariables, TemplateType } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const sheetTemplates = async (
  parent: any,
  args: SheetTemplatesQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const db = dbClient();

  const { rulesetId, published } = args;

  throwIfUnauthorized({
    rulesetId,
    published,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const sheetTemplates = await db.sheet.findMany({
    where: {
      rulesetId,
      pageId: null,
      templateType: TemplateType.SHEET,
    },
    include: {
      image: true,
      ruleset: {
        select: {
          title: true,
        },
      },
    },
  });

  return sheetTemplates.map((sheet: any) => ({
    ...sheet,
    id: sheet.entityId,
    username: sheet?.createdBy ?? '',
    rulesetTitle: sheet?.ruleset?.title ?? null,
  }));
};
