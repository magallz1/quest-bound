import { AuthorizationContext } from '@/infrastructure/types';
import { UpdateAttributeOrderMutationVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';

export const updateAttributeOrder = async (
  parent: any,
  args: UpdateAttributeOrderMutationVariables,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;

  const { input } = args;

  const db = dbClient();

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  await Promise.all(
    input.attributes.map(async (attribute: any) => {
      await db.attribute.update({
        where: {
          id: `${attribute.id}-${input.rulesetId}`,
        },
        data: {
          sortChildId: attribute.sortChildId,
        },
      });
    }),
  );

  return `Successfully updated attribute order for ruleset ${input.rulesetId}`;
};
