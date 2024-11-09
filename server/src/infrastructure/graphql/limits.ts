import { ResourceLimit } from '../types';

export const freeLimits = new Map<ResourceLimit, number>([
  [ResourceLimit.CHARACTER, 1],
  [ResourceLimit.PLAYER, 5],
  [ResourceLimit.RULESET, 1],
  [ResourceLimit.PUBLICATION, 0],
]);

export const creatorLimits = new Map<ResourceLimit, number>([
  [ResourceLimit.PLAYER, 15],
  [ResourceLimit.PUBLICATION, 1],
]);
