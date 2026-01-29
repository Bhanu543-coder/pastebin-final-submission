import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('✅ Successfully connected to Upstash Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export default redis;
// import Redis from 'ioredis';
// import dotenv from 'dotenv';

// dotenv.config();

// const redis = new Redis(process.env.REDIS_URL, {
//   connectTimeout: 10000, // 10 seconds timeout
//   maxRetriesPerRequest: 3,
//   retryStrategy(times) {
//     const delay = Math.min(times * 50, 2000);
//     return delay;
//   },
// });

// redis.on('error', (err) => console.error('❌ Redis Error:', err.message));

// export default redis;