import { Router } from 'express';
import { nanoid } from 'nanoid';
import redis from '../config/redis.js';
import { getNow } from '../utils/time.js';
import { validatePasteInput } from '../middleware/validate.js';

const router = Router();

router.post('/', validatePasteInput, async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;
  const id = nanoid(10);
  const now = getNow();
  
  const expiresAt = ttl_seconds 
    ? new Date(now.getTime() + ttl_seconds * 1000).toISOString() 
    : null;

  const pasteData = {
    content,
    max_views: max_views || null,
    current_views: 0,
    expires_at: expiresAt
  };

  // Save data as JSON string
  await redis.set(`paste:${id}`, JSON.stringify(pasteData));
  
  // Set physical Redis expiry if TTL exists for auto-cleanup
  if (ttl_seconds) {
    await redis.expire(`paste:${id}`, ttl_seconds);
  }

  res.status(201).json({
    id,
    url: `${process.env.BASE_URL || 'http://localhost:3000'}/p/${id}`
  });
});

// GET /api/pastes/:id for the JSON API requirement
router.get('/:id', async (req, res) => {
    // ... logic same as /p/:id but returns JSON instead of HTML ...
});

export default router;