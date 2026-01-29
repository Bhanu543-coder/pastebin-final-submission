import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

// This configuration is optimized for Vercel's serverless environment
const redis = new Redis(redisUrl, {
    connectTimeout: 10000, // Wait up to 10s to connect
    maxRetriesPerRequest: 0, // Serverless functions should fail fast if the DB is down
    tls: {
        // Essential for Upstash secure connections
        rejectUnauthorized: false 
    }
});

redis.on('error', (err) => console.error('❌ Redis Connection Error:', err.message));

export default redis;