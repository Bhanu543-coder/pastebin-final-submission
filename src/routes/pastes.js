import { Router } from 'express';
import { nanoid } from 'nanoid';
import redis from '../config/redis.js';
import { getNow } from '../utils/time.js';
import { validatePasteInput } from '../middleware/validate.js';

const router = Router();

// CREATE a new paste
router.post('/', validatePasteInput, async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;
    const id = nanoid(10);
    const now = getNow();
    
    const expiresAt = ttl_seconds 
      ? new Date(now.getTime() + ttl_seconds * 1000).toISOString() 
      : null;

    const pasteData = {
      content,
      max_views: max_views ? parseInt(max_views) : null,
      current_views: 0,
      expires_at: expiresAt
    };

    // Store the data in Redis as a JSON string
    await redis.set(`paste:${id}`, JSON.stringify(pasteData));
    
    if (ttl_seconds) {
      await redis.expire(`paste:${id}`, ttl_seconds);
    }

    res.status(201).json({
      id,
      url: `${process.env.BASE_URL || 'http://localhost:3000'}/p/${id}`
    });
  } catch (error) {
    console.error("Error creating paste:", error);
    res.status(500).json({ error: "Failed to save paste to database" });
  }
});

// GET a specific paste by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rawData = await redis.get(`paste:${id}`);

    if (!rawData) {
      return res.status(404).json({ error: "Paste not found or has expired" });
    }

    const paste = JSON.parse(rawData);

    // 1. Check if max_views limit has been reached
    if (paste.max_views !== null && paste.current_views >= paste.max_views) {
      await redis.del(`paste:${id}`); // Delete immediately if limit reached
      return res.status(404).json({ error: "Paste is no longer available (view limit reached)" });
    }

    // 2. Increment view count
    paste.current_views += 1;

    // 3. If max_views reached after this view, delete it. Otherwise, update it.
    if (paste.max_views !== null && paste.current_views >= paste.max_views) {
      await redis.del(`paste:${id}`);
    } else {
      // Update the record in Redis
      // We use 'KEEPTTL' to ensure the original expiration time is preserved
      const ttl = await redis.ttl(`paste:${id}`);
      if (ttl > 0) {
        await redis.set(`paste:${id}`, JSON.stringify(paste), 'EX', ttl);
      } else {
        await redis.set(`paste:${id}`, JSON.stringify(paste));
      }
    }

    res.json({
      content: paste.content,
      expires_at: paste.expires_at,
      current_views: paste.current_views,
      max_views: paste.max_views
    });
  } catch (error) {
    console.error("Error retrieving paste:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;