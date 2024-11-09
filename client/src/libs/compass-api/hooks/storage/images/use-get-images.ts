import { images, ImagesQuery } from '../../../gql';
import { useQuery } from '../../../utils';
import { useError } from '../../metrics';

export const useGetImages = () => {
  const { data, refetch, error, loading } = useQuery<ImagesQuery>(images);

  useError({
    error,
    message: 'Failed to load images.',
    location: 'useGetImages',
  });

  return {
    images: data?.images ?? [],
    refetch,
    loading,
  };
};
