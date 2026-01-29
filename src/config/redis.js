import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

// This configuration is mandatory for Vercel + Upstash TLS
const redis = new Redis(redisUrl, {
    connectTimeout: 10000, 
    maxRetriesPerRequest: 0, 
    tls: {
        rejectUnauthorized: false // Necessary for cloud TLS handshakes
    }
});

redis.on('error', (err) => console.error('❌ Redis Connection Error:', err.message));

export default redis;