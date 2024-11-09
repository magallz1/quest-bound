import { useParams } from 'react-router-dom';
import {
  Sheet,
  sheetTemplates,
  SheetTemplatesQuery,
  SheetTemplatesQueryVariables,
} from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useSheetTemplates = (
  overrideRulesetId?: string,
  forceSkip?: boolean,
  published = false,
) => {
  const { rulesetId } = useParams();

  const { data, loading, error } = useQuery<SheetTemplatesQuery, SheetTemplatesQueryVariables>(
    sheetTemplates,
    {
      variables: {
        rulesetId: overrideRulesetId ?? rulesetId ?? '',
        published,
      },
      skip: forceSkip || (!rulesetId && !overrideRulesetId),
    },
  );

  useError({
    error,
    message: 'Failed to load templates',
  });

  return {
    sheets: (data?.sheetTemplates ?? []) as Sheet[],
    loading,
    error,
  };
};
