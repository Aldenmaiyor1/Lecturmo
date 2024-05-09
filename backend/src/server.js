// Configure environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './config/strategies/local-strategy.js';
import { fa } from '@faker-js/faker';

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;
const SECRET_KEY = process.env.COOKIE_SECRET_KEY ?? '39608663';
const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING ??
  'mongodb://localhost:27017/lecturmon';

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https:\/\/lecturmon\.onrender\.com(\/.*)?$/,
      /^https:\/\/(?:lecturmo(?:n)?|lecturemon)\.netlify\.app(\/.*)?$/,
      '*'
    ];

    const originIsAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        // return origin === allowedOrigin;
        return true
      } else {
        return allowedOrigin.test(origin);
      }
    });

    if (!origin || originIsAllowed) {
      callback(null, true); // Allow the request if no origin or if it's from an allowed origin
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

// Creates the express server
export async function startExpress() {
  const app = express();

  // Configure middleware
  app.use(morgan('combined'));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.static('public'));

  app.use(cookieParser(SECRET_KEY));
  app.use(
    session({
      secret: SECRET_KEY,
      saveUninitialized: false,
      resave: true,
      store: MongoStore.create({
        mongoUrl: MONGODB_CONNECTION_STRING,
        collection: 'sessions',
      }), //session is now stored in db
      cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: 'lax'
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Import and use our application routes.
  app.use('/', routes);

  app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));
}
