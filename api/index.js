import { Router } from 'express';
import v1 from './v1/routes/index.js';

const router = Router();

router.use('/v1', v1);

export default router;
