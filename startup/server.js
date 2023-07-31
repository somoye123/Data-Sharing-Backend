import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import vm from 'v-response';
import helmet from 'helmet';
import xss from 'xss-clean';

import ApiVersions from '../api/index.js';
import { ErrorMiddleware } from '../middlewares/index.js';
import AppError from '../utils/appError.js';

const app = express();

export default () => {
  app.use(cors());

  app.use(helmet());

  app.set('trust proxy', 1);

  if (process.env.NODE_ENV === 'development') {
    console.log('No rate limit in development mode!');
  } else {
    //  apply to all requests
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200, // limit each IP to 200 requests per windowMs
        message: 'Too many requests from this IP. Try again in 15 mins.',
      })
    );
  }

  // logger middleware
  app.use((req, _, next) => {
    vm.log(
      `🔥🍕[${new Date().toTimeString()}]: `,
      `${req.method} ${req.url}🔥🍕`
    );
    next();
  });

  // Add middlewares for parsing JSON and urlencoded data and populating `req.body`
  app.use(express.urlencoded({ extended: false }));

  // parse requests of content-type - application/json
  app.use(express.json());

  // Data sanitization against XSS (cross-site scripting)
  app.use(xss());

  // simple route
  app.get('/', (_, res) => {
    res.json({ message: 'Welcome to Data Sharing Application API.' });
  });

  app.use('/api', ApiVersions);

  app.all('*', (req, _, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  app.use(ErrorMiddleware);

  // set port, listen for requests
  app.listen(process.env.PORT).on('listening', () => {
    vm.log('💘 app is listening on ', `${process.env.PORT} 🚀`);
  });
};
