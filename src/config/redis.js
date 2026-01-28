import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// ioredis automatically handles the rediss:// protocol for TLS
const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('✅ Successfully connected to Upstash Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export default redis;