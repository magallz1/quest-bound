import { AuthorizationContext } from '@/infrastructure/types';
import { CreatePageTemplateMutationVariables, TemplateType } from '../../generated-types';
import { dbClient } from '@/database';
import { convertEntityId, createTemplateFromSheet } from '../_shared';

export const createPageTemplate = async (
  parent: any,
  args: CreatePageTemplateMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { pageId, title, description, rulesetId } = args.input;

  const db = dbClient();
  const { toEntity } = convertEntityId(rulesetId);

  const pageToCopy = await db.page.findUnique({
    where: {
      id: `${pageId}-${rulesetId}`,
    },
    include: {
      ruleset: true,
      sheet: true,
    },
  });

  if (!pageToCopy) {
    throw Error('Page not found.');
  }

  if (pageToCopy.ruleset?.userId !== userId) {
    throw Error('Current user is not authorized to create this template.');
  }

  if (!pageToCopy.sheet) {
    throw Error('Cannot create a template from a page without a sheet');
  }

  const newTemplate = await createTemplateFromSheet({
    db,
    sheetId: toEntity(pageToCopy.sheet?.id),
    rulesetId,
    overrides: {
      rulesetId: pageToCopy.ruleset.id,
      templateType: TemplateType.PAGE,
      title,
      description,
    },
  });

  return newTemplate;
};
