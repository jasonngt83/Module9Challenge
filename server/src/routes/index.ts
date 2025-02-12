import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';
import historyService from '../service/historyService.js';

router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router;
