import { dbClient } from '@/database';
import { RemoveModule } from '@/infrastructure/graphql/generated-types';
import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';

/**
 * Creates a copy of all entities related to a published modules and asscoiates them with the ruleset
 */
export const removeModule = async (
  parent: any,
  args: ResolverInput<RemoveModule>,
  context: AuthorizationContext,
) => {
  const { userId } = context;

  const db = dbClient();

  const { input } = args;

  const existingRuleset = await db.ruleset.findUnique({
    where: {
      id: input.rulesetId,
    },
    include: {
      archetypes: true,
      sheets: {
        include: {
          components: true,
        },
      },
      modules: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingRuleset) {
    throw Error('Ruleset not found.');
  }

  if (existingRuleset.userId !== userId) {
    throw Error('Unauthorized.');
  }

  // The archetypes and their sheet components which are associated to the removed module
  const moduleArchetypes = existingRuleset.archetypes.filter(
    (a: any) => a.moduleId === input.moduleId,
  );
  const moduleArchetypeSheetComponents = existingRuleset.sheets.flatMap((s: any) =>
    s.components.filter((c: any) => {
      const componentData = JSON.parse(c.data as string);
      return moduleArchetypes.some((a: any) => a.entityId === componentData.archetypeId);
    }),
  );

  // Attributes
  await db.attribute.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Charts
  await db.chart.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Documents
  await db.document.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Sheets & Components
  await db.sheet.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Sheet components for archetypes
  await db.sheetComponent.deleteMany({
    where: {
      id: { in: moduleArchetypeSheetComponents.map((c: any) => c.id) },
    },
  });

  // Archetypes
  await db.archetype.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Pages
  await db.page.deleteMany({
    where: {
      rulesetId: input.rulesetId,
      moduleId: input.moduleId,
    },
  });

  // Disassociate the Module
  const rs = await db.ruleset.update({
    where: {
      id: input.rulesetId,
    },
    data: {
      modules: {
        disconnect: {
          id: input.moduleId,
        },
      },
    },
  });

  return rs;
};
