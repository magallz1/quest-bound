import { useContext, useState } from 'react';
import { SupabaseContext } from '../../provider';
import { useError } from '../metrics';

interface UploadFileProps {
  bucketName: string;
  fileKey: string;
  file: File;
}

export const useUploadFile = () => {
  const { client } = useContext(SupabaseContext);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  useError({
    error,
    message: 'Failed to load file',
  });

  const uploadFile = async ({ bucketName, fileKey, file }: UploadFileProps): Promise<string> => {
    setLoading(true);
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(fileKey, file, { upsert: true });
    setLoading(false);

    if (error) {
      setError(error);
      return '';
    }

    return data.path;
  };

  return {
    uploadFile,
    loading,
  };
};
