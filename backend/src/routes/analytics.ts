import { Router } from 'express';
const router = Router();

router.get('/dashboard', (_req, res) => {
  res.json({ success: true, message: 'Analytics API - to be implemented' });
});

export default router;