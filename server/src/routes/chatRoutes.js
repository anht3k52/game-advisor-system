import { Router } from 'express';
import { chatWithAdvisor } from '../controllers/chatController.js';

const router = Router();

router.post('/', chatWithAdvisor);

export default router;
