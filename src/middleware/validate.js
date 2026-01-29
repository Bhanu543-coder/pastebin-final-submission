export const validatePasteInput = (req, res, next) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === "") {
    return res.status(400).json({ error: "content is required and must be a non-empty string" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "ttl_seconds must be an integer >= 1" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "max_views must be an integer >= 1" });
  }

  next();
};