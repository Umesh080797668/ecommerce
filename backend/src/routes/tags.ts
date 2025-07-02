import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Tags API - to be implemented' });
});

export default router;