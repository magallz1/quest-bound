import { dbClient } from '@/database';
import { AuthorizationContext } from '@/infrastructure/types';
import { Ruleset, RulesetSalesPageQueryVariables } from '../../generated-types';

export const rulesetSalesPage = async (
  parent: any,
  args: RulesetSalesPageQueryVariables,
  context: AuthorizationContext,
) => {
  const { id } = args;
  const { userId } = context;

  const db = dbClient();

  const ruleset = await db.publishedRuleset.findUnique({
    where: {
      id,
    },
    include: {
      userPermissions: true,
      image: true,
      archetypes: {
        select: {
          id: true,
        },
      },
      sheets: {
        select: {
          type: true,
          templateType: true,
          _count: true,
        },
      },
      attributes: {
        select: {
          type: true,
        },
      },
      charts: true,
      documents: true,
      pages: {
        select: {
          _count: true,
        },
      },
    },
  });

  if (!ruleset) {
    throw Error('Ruleset not found.');
  }

  const currentUserPermission = ruleset.userPermissions.find((p: any) => p.userId === userId);

  const details = {
    archetypeCount: ruleset.archetypes.length,
    attributeCount: ruleset.attributes.filter((a: any) => a.type !== 'ITEM').length,
    itemCount: ruleset.attributes.filter((a: any) => a.type === 'ITEM').length,
    chartCount: ruleset.charts.length - 1, // subtract 1 for the archetype chart
    documentCount: ruleset.documents.length,
    pageCount: ruleset.pages.length,
    templateCount: ruleset.sheets.filter(
      (s: any) => s.type === 'TEMPLATE' && s.templateType === 'SHEET',
    ).length,
  };

  return {
    id: ruleset.id,
    live: ruleset.live,
    currentUserHasPermission: !!currentUserPermission,
    shelved: currentUserPermission?.shelved ?? false,
    createdBy: ruleset.createdBy,
    createdAt: ruleset.createdAt.toString(),
    title: ruleset.title,
    description: ruleset.description,
    price: ruleset.currentPrice,
    details: JSON.stringify(details),
    images: ruleset.image ? [ruleset.image] : [],
    includesAI: ruleset.includesAI,
    includesPDF: ruleset.includesPDF,
    explicit: ruleset.explicit,
  };
};
