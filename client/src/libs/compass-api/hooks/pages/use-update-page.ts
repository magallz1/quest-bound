import { useParams } from 'react-router-dom';
import {
  UpdatePage,
  updatePages as updatePagesMutation,
  UpdatePagesMutation,
  UpdatePagesMutationVariables,
} from '../../gql';
import { useMutation } from '../../utils';
import { useError } from '../metrics';
import { useCacheHelpers } from './cache-helpers';

export const useUpdatePage = () => {
  const { rulesetId } = useParams();
  const [mutation, { loading, error }] = useMutation<
    UpdatePagesMutation,
    UpdatePagesMutationVariables
  >(updatePagesMutation);

  useError({
    error,
    message: 'Failed to save page.',
    location: 'useUpdatePage',
  });

  const { updatePageCacheOnly } = useCacheHelpers();

  const updatePage = async (
    update: Omit<UpdatePage, 'rulesetId'>,
    opt?: { cacheOnly?: boolean },
  ) => {
    if (!rulesetId) return;
    const pageUpdates = updatePageCacheOnly({ update: { ...update, rulesetId } });

    if (opt?.cacheOnly) {
      return pageUpdates.find((page) => page.id === update.id);
    }

    if (!pageUpdates) {
      throw Error('Unable to update page');
    }

    const res = await mutation({
      variables: {
        input: pageUpdates,
      },
    });

    if (!res.data?.updatePages) {
      throw Error('Unable to save page');
    }

    return res.data.updatePages.find((page) => page.id === update.id);
  };

  return {
    updatePage,
    loading,
    error,
  };
};
