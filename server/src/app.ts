import express from 'express';
import dotenv from 'dotenv';
import { initializeRestfulEndpoints } from './infrastructure/rest';
import { initializeGqlServer } from './infrastructure/graphql';
import cors from 'cors';
import { storageDir } from './infrastructure/rest/services/storage/file-upload';

dotenv.config();

const app = express();

app.use(cors());
app.use('/metrics', express.text());
app.use('/storage', express.static(storageDir));

app.use(express.json());

const initializeServer = async () => {
  initializeGqlServer(app);
  initializeRestfulEndpoints(app);

  app.get('/', (req, res) => {
    res.send({
      '': `
    ____    ____  
   / __ \\  |  _ \\ 
  | |  | | | |_)|
  | |  | | |  _ < 
  | |__| | | |_)|
   \\___/_\\ |____/ `,
    });
  });
};

initializeServer();
