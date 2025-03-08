import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.URL_CLIENT || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
