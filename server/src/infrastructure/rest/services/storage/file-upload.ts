import { RestfulAuthContext } from '@/infrastructure/types';
import { RestfulResponse } from '../../types';
import { promises as fs } from 'fs';
import path from 'path';

export const storageDir = __dirname.includes('src')
  ? path.join(__dirname.split('src')[0], 'dist', 'storage')
  : path.join(__dirname.split('dist')[0], 'dist', 'storage');

type uploadFileProps = {
  userId: string;
  bucketName: string;
  contentType: string;
  objectName: string;
};

/**
 * Moves file from /storage/uploads to the appropriate directory
 */
export const uploadFile = async (
  data: uploadFileProps,
  _authContext: RestfulAuthContext,
  file?: Express.Multer.File,
): Promise<RestfulResponse> => {
  try {
    if (!file) {
      return {
        body: JSON.stringify({ msg: 'file is required' }),
        statusCode: 400,
      };
    }

    const { bucketName, objectName } = data;
    const { filename } = file;

    await fs.copyFile(
      `${storageDir}/uploads/${filename}`,
      `${storageDir}/${bucketName}/` + objectName.replace(/ /g, '-'),
    );
    await fs.rm(`${storageDir}/uploads/${filename}`);

    return {
      body: JSON.stringify({ msg: 'success' }),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};
