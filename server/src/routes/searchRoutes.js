import { Router } from 'express';
import { advancedSearch } from '../controllers/searchController.js';

const router = Router();

router.get('/', advancedSearch);

export default router;
