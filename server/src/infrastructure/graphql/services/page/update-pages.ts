import { AuthorizationContext } from '@/infrastructure/types';
import { UpdatePage, UpdatePagesMutationVariables } from '../../generated-types';
import { convertEntityId } from '../_shared';
import { dbClient } from '@/database';

export const updatePages = async (
  parent: any,
  args: UpdatePagesMutationVariables,
  context: AuthorizationContext,
) => {
  const { userId } = context;
  const { input } = args;

  const { fromEntity, toEntity } = convertEntityId(input[0].rulesetId);

  const db = dbClient();

  const updates = await db.page.findMany({
    where: {
      id: {
        in: input.map((update) => fromEntity(update.id)),
      },
    },
    include: {
      ruleset: {
        select: {
          userId: true,
        },
      },
      Character: {
        select: {
          userId: true,
        },
      },
    },
  });

  const authorizedUpdates = updates
    .filter(
      (update: any) => update.ruleset?.userId === userId || update.Character?.userId === userId,
    )
    .map((update: any) => input.find((inputUpdate) => inputUpdate.id === update.entityId))
    .filter((update: any) => !!update) as UpdatePage[];

  if (authorizedUpdates.length !== input.length) {
    throw Error('Current user is not authorized to update some of these pages.');
  }

  const authorizedTransactions = input.filter((update) =>
    authorizedUpdates.some((authorizedUpdate) => authorizedUpdate.id === update.id),
  );

  const res = await Promise.all(
    authorizedTransactions.map((update) =>
      db.page.update({
        where: {
          id: fromEntity(update.id),
        },
        include: {
          sheet: {
            select: {
              entityId: true,
            },
          },
        },
        data: {
          title: update.title ?? undefined,
          archetypeId: update.archetypeId ?? undefined,
          sortIndex: update.sortIndex ?? undefined,
          details: update.details ?? undefined,
          content: update.content ?? undefined,
          parentId: update.parentId ? fromEntity(update.parentId) : update.parentId, // Could be null
          ...(update.sheetId && {
            sheet: {
              connect: {
                id: fromEntity(update.sheetId),
              },
            },
          }),
          ...(update.sheetId === null && {
            sheet: {
              disconnect: true,
            },
          }),
        },
      }),
    ),
  );

  return res.map((page) => ({
    ...page,
    id: page.entityId,
    parentId: page.parentId ? toEntity(page.parentId) : page.parentId,
    sheetId: page.sheet?.entityId ?? null,
  }));
};
