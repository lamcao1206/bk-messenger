import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { NotFoundException } from './cores/application.exception.js';
import { initializeSocket } from './lib/socket.js';

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017/bk-messenger';

const corsOptions = {
  origin: process.env.URL_CLIENT || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SIGNATURE));

app.use(morgan('dev'));

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundException(`${req.method} ${req.url} not found!`));
});

app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const error = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    status: statusCode,
    error,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  });
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
    initializeSocket(server, corsOptions);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
