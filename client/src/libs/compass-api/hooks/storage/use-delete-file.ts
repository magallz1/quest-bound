import { useContext, useState } from 'react';
import { SupabaseContext } from '../../provider';
import { useError } from '../metrics';

interface DeleteFileProps {
  bucketName: string;
  fileName: string;
}

export const useDeleteFile = () => {
  const { client } = useContext(SupabaseContext);
  const [error, setError] = useState<Error>();

  useError({
    error,
    message: 'Failed to delete file',
  });

  const deleteFile = async ({ bucketName, fileName }: DeleteFileProps) => {
    const { error } = await client.storage.from(bucketName).remove([fileName]);

    if (error) {
      setError(error);
    }
  };

  return {
    deleteFile,
  };
};
