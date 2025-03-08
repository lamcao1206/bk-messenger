import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import { NotFoundException } from './cores/application.exception.js';

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.DB_URL || 'mongodb://localhost:27017/bk-messenger';

app.use(
  cors({
    origin: process.env.URL_CLIENT || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundException(`${req.method} ${req.url} not found!`));
});

app.use((err, req, res, next) => {
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
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
