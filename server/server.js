import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { NotFoundException } from './cores/application.exception.js';
import initializeDatabase from './lib/db.js';
import jwt from 'jsonwebtoken';
import { app, server } from './lib/socket.js';
import { corsOptions, host, port, cookieSignature } from './lib/config.js';
const { TokenExpiredError } = jwt;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(cookieSignature));

app.use(morgan('dev'));

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundException(`${req.method} ${req.url} not found!`));
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'dev') {
    console.error(err);
  }
  let statusCode = err.statusCode || 500;
  let error = err.message || 'Internal Server Error';
  if (err instanceof TokenExpiredError) {
    statusCode = 403;
  }

  return res.status(statusCode).json({
    status: statusCode,
    error,
    ...(process.env.NODE_ENV === 'dev' && { stack: err.stack }),
  });
});

initializeDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(port, host, () => {
      console.log(`Server is running on ${host}:${port}...`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
