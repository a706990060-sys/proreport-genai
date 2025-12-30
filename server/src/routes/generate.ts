import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { generateSectionContent, refineSectionContent } from '../services/geminiService.js';
import { GenerateContentRequest, RefineContentRequest } from '../types/index.js';

const router = express.Router();

router.use(authenticateToken);

// 生成章节内容
router.post('/section', async (req: AuthRequest, res) => {
    try {
        const request: GenerateContentRequest = req.body;
        const content = await generateSectionContent(request);
        res.json({ success: true, data: content });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 修改/扩写章节内容
router.post('/refine', async (req: AuthRequest, res) => {
    try {
        const request: RefineContentRequest = req.body;
        const content = await refineSectionContent(request);
        res.json({ success: true, data: content });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;






