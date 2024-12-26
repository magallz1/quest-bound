import { LocalSupabaseClient } from './types';
import { promises as fs } from 'fs';
import path from 'path';

const storageDir = __dirname.includes('src')
  ? path.join(__dirname.split('src')[0], 'dist', 'storage')
  : path.join(__dirname.split('dist')[0], 'dist', 'storage');

export function createLocalSupabaseClient(): LocalSupabaseClient {
  const client = {
    storage: {
      from: (table: string) => ({
        download: (fileKey: string) => download(table, fileKey),
        remove: (fileKeys: string[]) => remove(table, fileKeys),
        copy: (fileKey: string, newKey: string) => copy(table, fileKey, newKey),
        createSignedUrl: (fileKey: string, expiresIn: number) =>
          createSignedUrl(table, fileKey, expiresIn),
      }),
    },
  };

  return client as LocalSupabaseClient;
}

async function download(table: string, fileKey: string) {
  console.log(`Downloading file ${fileKey} from table ${table}`);

  const file = await fs.readFile(`${storageDir}/${table}/${fileKey}`);

  return { data: new Blob([file]) };
}

async function remove(table: string, fileKeys: string[]) {
  console.log(`Removing files ${fileKeys} from table ${table}`);

  for (const fileKey of fileKeys) {
    await fs.rm(`${storageDir}/${table}/${fileKey}`);
  }

  return { data: new Blob() };
}

async function copy(table: string, fileKey: string, newKey: string) {
  console.log(`Copying file ${fileKey} from table ${table} to ${newKey}`);

  await fs.copyFile(`${storageDir}/${table}/${fileKey}`, `${storageDir}/${table}/${newKey}`);

  return { data: new Blob() };
}

async function createSignedUrl(table: string, fileKey: string, expiresIn: number) {
  console.log(`Creating URL for ${fileKey} from table ${table}. Expires in ${expiresIn}`);

  const signedUrl = `http://127.0.0.1:8000/storage/${table}/${fileKey}`;

  return { data: { signedUrl } };
}
