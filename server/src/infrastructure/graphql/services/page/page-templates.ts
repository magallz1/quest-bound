import { AuthorizationContext } from '@/infrastructure/types';
import { PageTemplatesQueryVariables, TemplateType } from '../../generated-types';
import { dbClient } from '@/database';

export const pageTemplates = async (
  parent: any,
  args: PageTemplatesQueryVariables,
  context: AuthorizationContext,
) => {
  const db = dbClient();
  const { rulesetId } = args;

  const templates = await db.sheet.findMany({
    where: {
      rulesetId,
      pageId: null,
      templateType: TemplateType.PAGE,
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

  return templates.map((sheet: any) => ({
    ...sheet,
    id: sheet.entityId,
    username: sheet?.createdBy ?? '',
    rulesetTitle: sheet?.ruleset?.title ?? null,
  }));
};
