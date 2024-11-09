import { AuthorizationContext, ResourceLimit } from '@/infrastructure/types';
import { UserRole } from '../../generated-types';
import { creatorLimits, freeLimits } from '../../limits';

interface ThrowIfUnauthorized {
  userPermittedRulesetReadIds?: string[];
  userPermittedRulesetWriteIds?: string[];
  userPermittedPublishedRulesetReadIds?: string[];
  published?: boolean | null;
  entity?: any;
  rulesetId?: string;
  role?: 'read' | 'write';
}

export function throwIfUnauthorized({
  rulesetId,
  entity,
  userPermittedRulesetWriteIds = [],
  userPermittedRulesetReadIds = [],
  userPermittedPublishedRulesetReadIds = [],
  role = 'read',
}: ThrowIfUnauthorized) {
  if (!entity && !rulesetId) return;
  const entityRulesetId = rulesetId ?? entity.rulesetId ?? entity.ruleset?.id ?? null;

  if (!entityRulesetId) return;

  if (role === 'read') {
    if (
      !userPermittedRulesetReadIds.includes(entityRulesetId) &&
      !userPermittedRulesetWriteIds.includes(entityRulesetId) &&
      !userPermittedPublishedRulesetReadIds.includes(entityRulesetId)
    ) {
      throw Error('Unauthorized');
    }
  }

  if (role === 'write') {
    if (!userPermittedRulesetWriteIds.includes(entityRulesetId)) {
      throw Error('Unauthorized');
    }
  }

  // Use the draft version if a user has access to it, otherwise use the published version
  const published =
    !userPermittedRulesetReadIds.includes(entityRulesetId) &&
    !userPermittedRulesetWriteIds.includes(entityRulesetId);
  return published;
}

export function readResolverContext(context: Record<string, string>): AuthorizationContext {
  if (!context.userId || !context.dbHost || !context.dbPassword || !context.userRole) {
    throw Error('Missing resolver context');
  }

  return {
    userId: context.userId,
    userRole: context.userRole as UserRole,
    userPermittedRulesetWriteIds: JSON.parse(context.userPermittedRulesetWriteIds),
    userPermittedRulesetReadIds: JSON.parse(context.userPermittedRulesetReadIds),
    userPermittedPublishedRulesetReadIds: JSON.parse(context.userPermittedPublishedRulesetReadIds),
  };
}

export function throwIfLimitExceeded({
  role,
  existingCount,
  resource,
}: {
  role: UserRole;
  existingCount: number;
  resource: ResourceLimit;
}) {
  return;
  // if (role === UserRole.PUBLISHER) return;

  // const limit = role === UserRole.CREATOR ? creatorLimits.get(resource) : freeLimits.get(resource);
  // if (limit === undefined) return;

  // if (existingCount >= limit) {
  //   throw Error('Limit exceeded');
  // }
}
