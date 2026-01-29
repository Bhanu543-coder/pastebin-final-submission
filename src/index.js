import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import redis from './config/redis.js';
import pasteRoutes from './routes/pastes.js';
import { getNow } from './utils/time.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/healthz', async (req, res) => {
  try {
    await redis.ping();
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.use('/api/pastes', pasteRoutes);

app.get('/p/:id', async (req, res) => {
  const { id } = req.params;
  const data = await redis.get(`paste:${id}`);
  
  if (!data) return res.status(404).send("Paste Not Found");

  const paste = JSON.parse(data);
  const now = getNow();

  
  if ((paste.expires_at && new Date(paste.expires_at) < now) || 
      (paste.max_views && paste.current_views + 1 > paste.max_views)) {
    await redis.del(`paste:${id}`);
    return res.status(404).send("This paste is no longer available.");
  }

  paste.current_views += 1;
  await redis.set(`paste:${id}`, JSON.stringify(paste));

  const safeContent = paste.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  res.send(`<!DOCTYPE html><html><head><title>View Paste</title></head><body><pre style="white-space: pre-wrap;">${safeContent}</pre></body></html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));