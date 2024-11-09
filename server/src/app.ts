import express from 'express';
import dotenv from 'dotenv';
import { initializeRestfulEndpoints } from './infrastructure/rest';
import { initializeGqlServer } from './infrastructure/graphql';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
// The Sentry proxy will forward an envelope body, which needs to be parsed as text
app.use('/metrics', express.text());
app.use('/payment-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
// app.use(
//   rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     limit: 200,
//     standardHeaders: 'draft-7',
//     legacyHeaders: false,
//   }),
// );

const initializeServer = async () => {
  initializeGqlServer(app);
  initializeRestfulEndpoints(app);

  app.get('/', (req, res) => {
    res.send({
      msg: `
    ____    ____  
   / __ \\  |  _ \\ 
  | |  | | | |_) |
  | |  | | |  _ < 
  | |__| | | |_) |
   \\___/_\\ |____/ `,
    });
  });
};

initializeServer();
