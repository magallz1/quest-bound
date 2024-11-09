import { UserRole } from './graphql';

export type AuthorizationContext = {
  userId: string;
  userRole: UserRole;
  userPermittedRulesetWriteIds: string[];
  userPermittedRulesetReadIds: string[];
  userPermittedPublishedRulesetReadIds: string[];
};

export type RestfulAuthContext = {
  id: string;
  email: string;
};

export type ResolverParams = {
  parent: any;
  args: any;
  context: AuthorizationContext;
};

export type ResolverInput<T> = {
  input: T;
};

export enum PermissionType {
  OWNER = 'OWNER',
  READ = 'READ',
  WRITE = 'WRITE',
}

export enum ResourceLimit {
  RULESET = 'RULESET',
  PUBLICATION = 'PUBLICATION',
  PLAYER = 'PLAYER',
  CHARACTER = 'CHARACTER',
  COLLABORATOR = 'COLLABORATOR',
}
