import express from 'express';

const router = express.Router();
router.get('/', (req, res, next) => {
  res.status(200).send('Welcome to BK Messenger API!');
});

export default router;
