import { createRuleset } from './create-ruleset';
import { deleteRuleset } from './delete-ruleset';
import { addModule, removeModule } from './modules';
import { officialContent } from './official-content';
import { permittedRulesets } from './permitted-rulesets';
import { permittedUsers } from './permitted-users';
import {
  addRulesetPermission,
  addToShelf,
  deletePublishedRuleset,
  publishRuleset,
  removeRulesetPermission,
  updatePublishedRuleset,
  updateRulesetPermission,
} from './publishing';
import { ruleset } from './ruleset';
import { rulesetSalesPage } from './ruleset-sales-page';
import { rulesets } from './rulesets';
import { addPlaytester, removePlaytester } from './sharing';
import { updateRuleset } from './update-ruleset';

export const rulesetResolvers = {
  Query: {
    ruleset,
    rulesets,
    permittedRulesets,
    permittedUsers,
    officialContent,
    rulesetSalesPage,
  },
  Mutation: {
    createRuleset,
    updateRuleset,
    deleteRuleset,
    addPlaytester,
    removePlaytester,
    addRulesetPermission,
    updateRulesetPermission,
    removeRulesetPermission,
    addToShelf,
    deletePublishedRuleset,
    publishRuleset,
    updatePublishedRuleset,
    addModule,
    removeModule,
  },
};
