import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL, {
  // Required for Upstash/Vercel to prevent ECONNRESET
  tls: {
    rejectUnauthorized: false 
  },
  connectTimeout: 10000, // Give more time for the cloud handshake
});

redis.on('error', (err) => console.error('❌ Redis Error:', err.message));

export default redis;