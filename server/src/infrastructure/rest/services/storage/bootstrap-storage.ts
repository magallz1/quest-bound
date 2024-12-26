import fs from 'fs';
import path from 'path';

const storageDir = path.join(__dirname.split('server')[0], 'server', 'dist', 'storage');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
  fs.mkdirSync(`${storageDir}/uploads`);
  fs.mkdirSync(`${storageDir}/documents`);
  fs.mkdirSync(`${storageDir}/images`);
  fs.mkdirSync(`${storageDir}/charts`);
}
