import { Router } from 'express';

const router = Router();

// GET / — API status
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SafeConnect Backend API',
  });
});

export default router;
