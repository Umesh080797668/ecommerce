import { Router } from 'express';
const router = Router();

router.post('/image', (_req, res) => {
  res.json({ success: true, message: 'Upload API - to be implemented' });
});

export default router;