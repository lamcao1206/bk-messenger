import redis from 'redis';

const redisClient = await redis
  .createClient({
    url: process.env.REDIS_URL,
  })
  .on('error', (err) => console.error(`Redis Connect error: ${err.message}`))
  .connect();

export default redisClient;
