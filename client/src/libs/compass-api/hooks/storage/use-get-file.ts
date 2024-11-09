import parser from 'papaparse';
import { useContext, useState } from 'react';
import { SupabaseContext } from '../../provider';
import { useError } from '../metrics';

interface GetFileProps {
  bucketName: string;
  fileName: string;
}

export const useGetFile = () => {
  const { client } = useContext(SupabaseContext);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  useError({
    error,
    message: 'Failed to load file',
  });

  const getFile = async ({ bucketName, fileName }: GetFileProps): Promise<Array<string[]>> => {
    setLoading(true);
    const { data, error } = await client.storage.from(bucketName).download(fileName);
    setLoading(false);

    if (error) {
      if (error.message === 'Object not found') {
        throw Error('File not found');
      }
      setError(error);
      return [];
    }

    const raw = await data?.text();

    if (raw === undefined) {
      setError(new Error('Failed to parse file'));
      return [];
    }

    const { data: parsedData, errors } = parser.parse(raw);

    if (errors.length > 0) {
      return [];
    }

    return parsedData as Array<string[]>;
  };

  return {
    getFile,
    loading,
  };
};
