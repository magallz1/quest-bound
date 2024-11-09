import { Ruleset } from '@/libs/compass-api';

interface Props {
  content: Ruleset[];
  typeFilter: string;
  parentFilter: string;
  searchFilter: string;
}

export const useFilterContent = ({ content, typeFilter, parentFilter, searchFilter }: Props) => {
  const sortedByDate = content.sort((a, b) => {
    return parseInt(a.createdAt) - parseInt(b.createdAt);
  });

  const filteredRulesets = sortedByDate.filter((ruleset) => {
    if (typeFilter === 'Modules') {
      return ruleset.isModule;
    }
    if (typeFilter === 'Rulesets') {
      return !ruleset.isModule;
    }
    return true;
  });

  const filteredByParent = filteredRulesets.filter((ruleset) => {
    if (typeFilter !== 'Modules' || parentFilter === 'All') {
      return true;
    }
    return ruleset.rulesetTitle === parentFilter;
  });

  const filteredBySearch = filteredByParent.filter((ruleset) => {
    if (searchFilter === '') {
      return true;
    }
    return ruleset.title.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return filteredBySearch;
};
