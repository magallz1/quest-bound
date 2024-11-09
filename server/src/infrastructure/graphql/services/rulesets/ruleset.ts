import { dbClient } from '@/database';
import { AuthorizationContext } from '@/infrastructure/types';
import { v4 as uuidv4 } from 'uuid';
import { convertEntityId, throwIfUnauthorized } from '../_shared';
import { SheetType, Ruleset } from '../../generated-types';

export const ruleset = async (parent: any, args: Ruleset, context: AuthorizationContext) => {
  const {
    userPermittedRulesetReadIds,
    userPermittedRulesetWriteIds,
    userId,
    userPermittedPublishedRulesetReadIds,
  } = context;

  const { id } = args;

  const db = dbClient();
  const { toEntity } = convertEntityId(id);

  const published = throwIfUnauthorized({
    rulesetId: id,
    userPermittedRulesetWriteIds,
    userPermittedRulesetReadIds,
    userPermittedPublishedRulesetReadIds,
  });

  const ruleset = await db.ruleset.findUnique({
    where: {
      id,
    },
    include: {
      modules: {
        include: {
          image: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      image: true,
      pages: {
        select: {
          entityId: true,
          parentId: true,
          sortIndex: true,
        },
      },
      playTesters: {
        include: {
          user: {
            include: {
              avatar: {
                select: {
                  src: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!ruleset) {
    throw Error('Ruleset not found.');
  }

  const permissions = [];
  if (userPermittedRulesetReadIds.includes(id)) {
    permissions.push('READ');
  }
  if (userPermittedRulesetWriteIds.includes(id)) {
    permissions.push('WRITE');
  }
  if (ruleset.userId === userId) {
    permissions.push('OWNER');
    permissions.push('WRITE');
    permissions.push('READ');
  }

  const publishedRuleset = await db.publishedRuleset.findUnique({
    where: {
      id,
    },
    include: {
      image: true,
      pages: {
        select: {
          entityId: true,
          parentId: true,
          sortIndex: true,
        },
      },
    },
  });

  if (published && !publishedRuleset) {
    throw Error('Published ruleset not found.');
  }

  const content = (published ? publishedRuleset : ruleset) as unknown as Ruleset;

  return {
    ...content,
    published: !!publishedRuleset,
    live: publishedRuleset?.live ?? false,
    includesAI: publishedRuleset?.includesAI ?? false,
    includesPDF: publishedRuleset?.includesPDF ?? false,
    explicit: publishedRuleset?.explicit ?? false,
    createdAt: content.createdAt,
    rulesetPermissions:
      typeof content.rulesetPermissions === 'string'
        ? ruleset.rulesetPermissions
        : JSON.stringify(ruleset.rulesetPermissions),
    permissions,
    pages: content.pages.map((page: any) => ({
      id: page.entityId,
      parentId: page.parentId ? toEntity(page.parentId) : null,
      sortIndex: page.sortIndex,
    })),
    modules: published ? [] : content.modules,
    playtesters: published
      ? []
      : ruleset.playTesters.map((pt: any) => ({
          ...pt.user,
          avatarSrc: pt.user.avatar?.src ?? null,
        })),
  };
};
