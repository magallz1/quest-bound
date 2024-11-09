import { AuthorizationContext, ResolverInput } from '@/infrastructure/types';
import { DeleteEntity } from '../../generated-types';
import { dbClient } from '@/database';
import { convertEntityId, throwIfUnauthorized } from '../_shared';

export const deleteAttribute = async (
  parent: any,
  args: ResolverInput<DeleteEntity>,
  context: AuthorizationContext,
) => {
  const { userPermittedRulesetReadIds, userPermittedRulesetWriteIds } = context;

  const { input } = args;

  const db = dbClient();
  const { fromEntity, toEntity } = convertEntityId(input.rulesetId);

  throwIfUnauthorized({
    rulesetId: input.rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    role: 'write',
  });

  const attribute = await db.attribute.findUnique({
    where: {
      id: fromEntity(input.id),
    },
  });

  const sortedParent = await db.attribute.findFirst({
    where: {
      rulesetId: input.rulesetId,
      sortChildId: input.id,
    },
  });

  // Set deleted attribute's child as its parent's sortChildId if it exists
  if (attribute?.sortChildId) {
    const sortedChild = await db.attribute.findUnique({
      where: {
        id: fromEntity(attribute.sortChildId),
      },
    });

    if (sortedParent && sortedChild) {
      await db.attribute.update({
        where: {
          id: sortedParent.id,
        },
        data: {
          sortChildId: toEntity(sortedChild.id),
        },
      });
    }
    // Set parent's sortChildId to null if deleted attribute has no child
  } else if (!!sortedParent) {
    await db.attribute.update({
      where: {
        id: sortedParent.id,
      },
      data: {
        sortChildId: null,
      },
    });
  }

  await db.attribute.delete({
    where: {
      id: fromEntity(input.id),
    },
  });

  return `Successfully delete attribute ${input.id}`;
};
