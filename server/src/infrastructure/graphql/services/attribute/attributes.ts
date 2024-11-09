import { AuthorizationContext } from '@/infrastructure/types';
import { AttributeType, AttributesQueryVariables } from '../../generated-types';
import { dbClient } from '@/database';
import { throwIfUnauthorized } from '../_shared';
import { syncAttributeLogic } from './utils';

export const attributes = async (
  parent: any,
  args: AttributesQueryVariables,
  context: AuthorizationContext,
) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { rulesetId, page, type } = args;
  const perPage = 1;

  const db = dbClient();

  const published = throwIfUnauthorized({
    rulesetId: rulesetId,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  // If a type is not provided, return all attributes except ITEM
  const typeQuery = !!type
    ? { equals: type }
    : {
        not: {
          equals: AttributeType.ITEM,
        },
      };

  const paginationQuery =
    page === undefined || page === null
      ? undefined
      : {
          skip: (page - 1) * perPage,
          take: perPage,
        };

  const query = {
    ...paginationQuery,
    where: {
      rulesetId,
      type: typeQuery,
    },
    include: {
      image: true,
      ruleset: {
        select: {
          userId: true,
        },
      },
    },
  };

  const getAttributes = async () => {
    return published
      ? await db.publishedAttribute.findMany(query)
      : await db.attribute.findMany(query);
  };

  let attributes = await getAttributes();

  // No attributes have a sortChildId, they were created before the implementation
  // Assign a sortChildId to each attribute
  if (!published && attributes.length > 0 && !attributes.some((a: any) => !!a.sortChildId)) {
    const sortedAttributes = [...attributes].sort((a: any, b: any) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const updatedAttributes = sortedAttributes.map((a: any, i: number) => {
      const next = sortedAttributes[i + 1];
      return {
        id: a.id,
        sortChildId: next?.entityId ?? null,
      };
    });
    await Promise.all(
      updatedAttributes.map((a: any) =>
        db.attribute.update({
          where: {
            id: a.id,
          },
          data: {
            sortChildId: a.sortChildId,
          },
        }),
      ),
    );

    attributes = await db.attribute.findMany({
      ...paginationQuery,
      where: {
        rulesetId,
        type: typeQuery,
      },
      include: {
        image: true,
        ruleset: {
          select: {
            userId: true,
          },
        },
      },
    });
  }

  return attributes.map((attribute: any) =>
    syncAttributeLogic({
      ...attribute,
      source: attribute.moduleTitle,
      id: attribute.entityId,
      data: JSON.stringify(attribute.data),
    }),
  );
};
