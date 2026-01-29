import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.error("❌ REDIS_URL is missing!");
}

const redis = new Redis(redisUrl, {
    connectTimeout: 10000, // 10 seconds to allow for cloud handshake
    maxRetriesPerRequest: 1, // Fail fast so the function doesn't hang
    tls: {
        rejectUnauthorized: false // Necessary for many cloud Redis providers
    }
});

redis.on('error', (err) => {
    // This will show up in your Vercel logs
    console.error('❌ Redis Connection Error:', err.message);
});

export default redis;