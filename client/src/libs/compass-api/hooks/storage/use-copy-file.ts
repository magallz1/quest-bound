import { useContext, useState } from 'react';
import { SupabaseContext } from '../../provider';
import { useError } from '../metrics';

interface CopyFileProps {
  bucketName: string;
  fileName: string;
  templateName: string;
}

export const useCopyFile = () => {
  const { client } = useContext(SupabaseContext);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  useError({
    error,
    message: 'Failed to copy template file',
  });

  const copyFile = async ({ bucketName, fileName, templateName }: CopyFileProps) => {
    setLoading(true);
    const { error } = await client.storage.from(bucketName).copy(templateName, fileName);

    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return {
    copyFile,
    loading,
  };
};
