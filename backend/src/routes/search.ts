import { Router } from 'express';
const router = Router();

router.get('/posts', (_req, res) => {
  res.json({ success: true, message: 'Search API - to be implemented' });
});

export default router;