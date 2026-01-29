import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

// Ensure the URL is valid before connecting
if (!redisUrl) {
    console.error("❌ REDIS_URL is missing in environment variables");
}

const redis = new Redis(redisUrl, {
    connectTimeout: 10000, // Give it 10 seconds to connect
    lazyConnect: true,     // Don't connect until the first command is sent
    tls: {
        rejectUnauthorized: false // Required for some cloud providers like Upstash
    }
});

redis.on('error', (err) => console.error('❌ Redis Error:', err.message));

export default redis;