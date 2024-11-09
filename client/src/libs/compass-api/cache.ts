import { InMemoryCache } from '@apollo/client/core';

/*
  Modules can be applied to multiple rulesets, meaning the ID alone is not enough to uniquely identify them.

  In the DB, ruleset entities have IDs that are the combination of their entityId and the rulesetId. In GraphQL, the entity
  ID is returned as the ID so that all associations work as is, no matter how many copies of the ruleset are made. When attributes reference
  each other in logic, for example, they use their entityIds so logic does not have to be updated when copies are made.

  The use of the entityId (not unique) as the ID (unique) means there could be cache collisions if multiple rulesets are opened
  in the same session. To avoid this, we need the cache key to include the rulesetId, the combination of which is unique.

  This applies to all ruleset entities--attributes, archetypes, sheets, components, etc.
*/

export const cache = new InMemoryCache({
  typePolicies: {
    Attribute: {
      keyFields: ['id', 'rulesetId'],
    },
    Archetype: {
      keyFields: ['id', 'rulesetId'],
    },
    Sheet: {
      keyFields: ['id', 'rulesetId'],
      fields: {
        components: {
          merge(existing = [], incoming: any[]) {
            // This merge is only used for stream subscriptions (because components are otherwise queried for independently)
            const deduped = existing.filter((e: any) => !incoming.some((i) => i.id === e.id));
            return [...deduped, ...incoming];
          },
        },
      },
    },
    SheetComponent: {
      // Components have entity IDs scoped to their sheet
      keyFields: ['id', 'sheetId', 'rulesetId'],
    },
    Page: {
      keyFields: ['id', 'rulesetId'],
    },
    Chart: {
      keyFields: ['id', 'rulesetId'],
    },
    Document: {
      keyFields: ['id', 'rulesetId'],
    },
    Item: {
      keyFields: ['id', 'rulesetId'],
    },
    RulesetSalesPage: {
      keyFields: ['id', 'currentUserHasPermission'],
    },
  },
});
